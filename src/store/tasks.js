import { create } from 'zustand'
import { helpHTTP } from '../helpers/helpHTTP'
import { helpTaskPosition } from '../helpers/helpTaskPosition'

export const useTasksStore = create((set, get) => ({
  project: null,
  darggingTask: null,
  loadingProject: false,
  loadingTask: false,
  columns: {
    todo: [],
    inProgress: [],
    done: []
  },

  getProject: async (id) => {
    set({ loadingProject: true })
    try {
      //Api
      const data = await helpHTTP().get(
        `http://localhost:8080/kanban-app/proyectos/${id}`
      )
      if (JSON.stringify(data).includes('Error')) throw data
      set({
        project: data,

        columns: {
          todo: data.tareas.filter((task) => task.estado === 'todo'),
          inProgress: data.tareas.filter(
            (task) => task.estado === 'inProgress'
          ),
          done: data.tareas.filter((task) => task.estado === 'done')
        },

        loadingProject: false
      })
    } catch (error) {
      console.log(error)
    }
  },

  createTask: async (endPoint, form) => {
    try {
      set({ loadingTask: true })

      const { columns } = get()
      //Agragar la ultima posicion a la tarea en la columna
      const newTask = { ...form, posicion: columns.todo.length + 1 }

      //Api
      const response = await helpHTTP().post(endPoint, {
        body: newTask
      })
      if (JSON.stringify(response).includes('Error')) throw response

      set((state) => ({
        columns: {
          ...state.columns,
          todo: [...state.columns.todo, response]
        }
      }))
    } catch (error) {
      console.log(`Create Task Error: ${error}`)
    } finally {
      set({ loadingTask: false })
    }
  },

  deleteTask: async (endPoint, id) => {
    try {
      //Api
      const response = await helpHTTP().del(endPoint)
      if (JSON.stringify(response).includes('Error')) throw response

      set((state) => ({
        columns: Object.fromEntries(
          Object.entries(state.columns).map(([key, items]) => [
            key,
            items.filter((item) => item.id !== id)
          ])
        )
      }))
    } catch (error) {
      console.log(`Delete Task Error: ${error}`)
    }
  },

  updateTask: async (endPoint, form, id) => {
    try {
      const { columns } = get()
      const { taskColumn, taskIndex } = helpTaskPosition(columns, id)

      const position =
        form.estado === taskColumn
          ? columns[taskColumn][taskIndex].posicion // Mantener la posición original
          : columns[form.estado].length + 1 //Asignar la posicion final en la columna

      // Actualizar la posición de la tarea en la nueva columna
      const updatedTask = { ...form, posicion: position }

      //Api
      const response = await helpHTTP().put(endPoint, { body: updatedTask })
      if (JSON.stringify(response).includes('Error')) throw response

      set((state) => {
        const { columns } = state

        //Si no cambia el estado se actualiza la tarea
        if (form.estado === taskColumn) {
          return {
            columns: {
              ...columns,
              [taskColumn]: columns[taskColumn].map((item, index) =>
                index === taskIndex ? response : item
              )
            }
          }
        }
        //Si cambia el estado se elimina y se agrega a la columna correspondiente
        return {
          columns: {
            ...columns,
            [taskColumn]: columns[taskColumn].filter((item) => item.id !== id), // Eliminar de la columna actual
            [form.estado]: [...columns[form.estado], response] // Agregar a la nueva columna
          }
        }
      })
    } catch (error) {
      console.error('Update Task Error:', error)
    }
  },

  updateStateTask: async (endPoint, form, id) => {
    try {
      const { columns } = get()
      const { taskColumn, taskIndex } = helpTaskPosition(columns, id)

      const position = columns[form.estado].length + 1 //Asignar la posicion final en la columna
      const updatedTask = { ...form, posicion: position }

      //Api
      const response = await helpHTTP().patch(endPoint, { body: updatedTask })
      if (JSON.stringify(response).includes('Error')) throw response

      set((state) => {
        const { columns } = state

        // Si la tarea cambia de columna
        if (form.estado !== taskColumn) {
          return {
            columns: {
              ...columns,
              [taskColumn]: columns[taskColumn].filter(
                (item) => item.id !== id
              ), // Eliminar de la columna actual
              [form.estado]: [...columns[form.estado], response] // Agregar a la nueva columna con la respuesta actualizada
            }
          }
        }

        // Si la tarea permanece en la misma columna
        return {
          columns: {
            ...columns,
            [taskColumn]: columns[taskColumn].map((item, index) =>
              index === taskIndex ? response : item
            )
          }
        }
      })
    } catch (error) {
      console.error('Update State Task Error:', error)
    }
  },

  dragStart: (id) => {
    const { columns } = get()
    const { task } = helpTaskPosition(columns, id)
    set({ darggingTask: task })
  },

  dragEnd: () => {
    set({ darggingTask: null })
  },

  onDrop: async (e) => {
    e.preventDefault()
    const { darggingTask, columns } = get()
    const previousState = structuredClone(columns)
    const newColumns = structuredClone(columns)

    const dropTargetClass = e.target.classList
    const columnMappings = {
      'kanban-todo': 'todo',
      'kanban-inprogress': 'inProgress',
      'kanban-done': 'done'
    }

    // const newEstado = Object.keys(columnMappings).find((className) =>
    //   dropTargetClass.contains(className)
    // )
    const newState = Object.entries(columnMappings).find(([className]) =>
      dropTargetClass.contains(className)
    )?.[1]

    const updatedTask = { ...darggingTask, estado: newState }
    const form = {
      estado: newState,
      posicion: columns[newState].length + 1
    }

    if (darggingTask) {
      if (darggingTask.estado !== newState) {
        //eliminar de la columna de estado actual
        newColumns[darggingTask.estado] = newColumns[
          darggingTask.estado
        ].filter((item) => item.id !== darggingTask.id)
        //Agregamos la tarea a la columna del nuevo estado
        newColumns[newState] = [...newColumns[newState], updatedTask]
      }

      set({ columns: newColumns }) // Actualizacion Optimista

      try {
        //Api
        const response = await helpHTTP().patch(
          `http://localhost:8080/kanban-app/estado/tareas/${darggingTask.id}`,
          { body: form }
        )
        if (JSON.stringify(response).includes('Error')) throw response
      } catch (error) {
        console.error(`Drop Update Task Error: ${error}`)
        // Opcional: revertir al estado anterior si hay un error
        set({ columns: previousState })
      }
    }
  },

  onDragOver: (e) => {
    e.preventDefault()
  },

  onDragLeave: (e) => {
    e.preventDefault()
  }
}))
