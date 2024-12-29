import { create } from 'zustand'
import { helpHTTP } from '../helpers/helpHTTP'
import { helpTaskPosition } from '../helpers/helpTaskPosition'
import endPoints from '../api/endpoints'

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
      const data = await helpHTTP().get(endPoints.tasks.getProject(id))
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
    } finally {
      set({ loadingProject: false })
    }
  },

  createTask: async (endPoint, form) => {
    const { columns } = get()
    const previousState = structuredClone(columns)
    //Agragar la ultima posicion a la tarea en la columna
    const newTask = { ...form, posicion: columns.todo.length + 1 }

    //Api
    try {
      set({ loadingTask: true })
      const response = await helpHTTP().post(endPoint, {
        body: newTask
      })
      if (JSON.stringify(response).includes('Error')) throw response
      //Estado Actualización optimista
      set((state) => ({
        columns: {
          ...state.columns,
          todo: [...state.columns.todo, response]
        }
      }))
    } catch (error) {
      console.log(`Create Task Error: ${error}`)
      // Retorna al estado anterior
      set({ columns: previousState })
    } finally {
      set({ loadingTask: false })
    }
  },

  deleteTask: async (endPoint, id) => {
    const { columns } = get()
    const previousState = structuredClone(columns)
    set((state) => {
      const { columns } = state

      const { taskColumn, task } = helpTaskPosition(columns, id)

      // Eliminar la tarea de la columna y ajustar posiciones
      const updatedColumn = columns[taskColumn]
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          posicion:
            item.posicion > task.posicion ? item.posicion - 1 : item.posicion
        }))
      console.log(updatedColumn)
      return {
        columns: {
          ...columns,
          [taskColumn]: updatedColumn
        }
      }
    })

    // API
    try {
      const response = await helpHTTP().del(endPoint)
      if (JSON.stringify(response).includes('Error')) throw response
    } catch (error) {
      console.error(`Delete Task Error: ${error}`)
      // Retorna al estado anterior
      set({ columns: previousState })
    }
  },
  updateTask: async (endPoint, form, id) => {
    const { columns } = get()
    const previousState = structuredClone(columns)
    const { taskColumn, taskIndex } = helpTaskPosition(columns, id)

    const position =
      form.estado === taskColumn
        ? columns[taskColumn][taskIndex].posicion // Mantener la posición original
        : columns[form.estado].length + 1 //Asignar la posicion final en la columna

    // Actualizar la posición de la tarea en la nueva columna
    const updatedTask = { ...form, posicion: position }

    //Actialización optimista del estado
    set((state) => {
      const { columns } = state

      //Si no cambia el estado se actualiza la tarea
      if (form.estado === taskColumn) {
        return {
          columns: {
            ...columns,
            [taskColumn]: columns[taskColumn].map((item, index) =>
              index === taskIndex ? updatedTask : item
            )
          }
        }
      }
      //Si cambia el estado se elimina y se agrega a la columna correspondiente
      const prevColumn = columns[taskColumn].filter((item) => item.id !== id)

      for (let task of prevColumn) {
        if (
          task.posicion >
          columns[taskColumn].find((item) => item.id === id).posicion
        ) {
          task.posicion -= 1
        }
      }
      console.log(prevColumn)
      return {
        columns: {
          ...columns,
          [taskColumn]: prevColumn, // Eliminar de la columna actual
          [form.estado]: [...columns[form.estado], updatedTask] // Agregar a la nueva columna
        }
      }
    })

    //Api
    try {
      const response = await helpHTTP().put(endPoint, { body: updatedTask })
      if (JSON.stringify(response).includes('Error')) throw response
    } catch (error) {
      console.error('Update Task Error:', error)
      // Retorna al estado anterior
      set({ columns: previousState })
    }
  },

  updateStateTask: async (endPoint, form, id) => {
    const { columns } = get()
    const previousState = structuredClone(columns)
    const { taskColumn, taskIndex, task } = helpTaskPosition(columns, id)

    const position = columns[form.estado].length + 1 //Asignar la posicion final en la columna
    const updatedState = { ...form, posicion: position }
    const updatedTask = { ...task, estado: form.estado, posicion: position }

    //Actualización optimista
    set((state) => {
      const { columns } = state

      const prevColumn = columns[taskColumn].filter((item) => item.id !== id)

      for (let task of prevColumn) {
        if (
          task.posicion >
          columns[taskColumn].find((item) => item.id === id).posicion
        ) {
          task.posicion -= 1
        }
      }
      console.log(prevColumn)

      // Si la tarea cambia de columna
      if (form.estado !== taskColumn) {
        return {
          columns: {
            ...columns,
            [taskColumn]: prevColumn, // Eliminar de la columna actual
            [form.estado]: [...columns[form.estado], updatedTask] // Agregar a la nueva columna con la respuesta actualizada
          }
        }
      }

      // Si la tarea permanece en la misma columna
      return {
        columns: {
          ...columns,
          [taskColumn]: columns[taskColumn].map((item, index) =>
            index === taskIndex ? updatedTask : item
          )
        }
      }
    })

    //Api
    try {
      const response = await helpHTTP().patch(endPoint, {
        body: updatedState
      })
      if (JSON.stringify(response).includes('Error')) throw response
    } catch (error) {
      console.error('Update State Task Error:', error)
      // Retorna al estado anterior
      set({ columns: previousState })
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

  onDropColumn: async (e) => {
    e.preventDefault()
    const { darggingTask, columns } = get()
    if (darggingTask.estado === 'done') return
    if (
      darggingTask.estado === 'inProgress' &&
      e.target.classList.contains('kanban-todo')
    )
      return
    if (
      darggingTask.estado === 'todo' &&
      e.target.classList.contains('kanban-done')
    )
      return

    const dropTargetClass = e.target.classList
    const columnMappings = {
      'kanban-todo': 'todo',
      'kanban-inprogress': 'inProgress',
      'kanban-done': 'done'
    }

    const newState = Object.entries(columnMappings).find(([className]) =>
      dropTargetClass.contains(className)
    )?.[1]

    const previousState = structuredClone(columns)

    // const newEstado = Object.keys(columnMappings).find((className) =>
    //   dropTargetClass.contains(className)
    // )

    if (darggingTask) {
      if (newState && darggingTask.estado !== newState) {
        const updatedTask = { ...darggingTask, estado: newState }
        const form = {
          estado: newState,
          posicion: columns[newState].length + 1
        }
        //Actualización optimista del estado
        set((state) => {
          // Filtrar la columna anterior para eliminar la tarea
          const prevColumn = state.columns[darggingTask.estado].filter(
            (item) => item.id !== darggingTask.id
          )

          for (let task of prevColumn) {
            if (task.posicion > darggingTask.posicion) {
              task.posicion -= 1
            }
          }

          // console.log(prevColumn)
          // Crear una nueva columna destino con la tarea actualizada al final
          const targetColumn = [
            ...state.columns[newState],
            { ...updatedTask, posicion: state.columns[newState].length + 1 }
          ]

          // Retornar el nuevo estado con ambas columnas actualizadas
          return {
            columns: {
              ...state.columns,
              [darggingTask.estado]: prevColumn,
              [newState]: targetColumn.sort((a, b) => a.posicion - b.posicion) // Orden explícito
            }
          }
        })
        try {
          //Api
          const response = await helpHTTP().patch(
            endPoints.tasks.updateState(darggingTask.id),
            { body: form }
          )
          if (JSON.stringify(response).includes('Error')) throw response
        } catch (error) {
          console.error(`Drop Update Task Error: ${error}`)
          set({ columns: previousState })
        }
      }
    }
  },

  onDropCard: async (e) => {
    e.preventDefault()

    const { columns, darggingTask } = get()

    if (darggingTask.id === Number(e.target.parentNode.id)) return
    if (
      darggingTask.estado === 'done' &&
      !e.target.parentNode.parentNode.classList.contains('kanban-done')
    )
      return
    if (
      darggingTask.estado === 'inProgress' &&
      e.target.parentNode.parentNode.classList.contains('kanban-todo')
    )
      return
    if (
      darggingTask.estado === 'todo' &&
      e.target.parentNode.parentNode.classList.contains('kanban-done')
    )
      return

    const taskDropId = Number(e.target.parentNode.id)
    let newPosition = null
    const previousState = structuredClone(columns)

    //Identificamos la tarea sobre la que se está haciendo el drop dentro de las columnas
    const { taskColumn, taskIndex, task } = helpTaskPosition(
      columns,
      taskDropId
    )

    if (e.target.classList.contains('cardUp')) {
      // console.log('up')
      // console.log('tarea:', task)
      if (taskIndex === 0) {
        newPosition = 0
        console.log('primero', newPosition)
      } else {
        newPosition = task.posicion
        // (columns[taskColumn][taskIndex - 1].posicion + task.posicion) / 2
        console.log('la nueva posicion es:', newPosition)
      }
    } else if (e.target.classList.contains('cardDown')) {
      // console.log('down')
      // console.log('tarea:', task)
      if (taskIndex === columns[taskColumn].length - 1) {
        newPosition =
          darggingTask.estado === taskColumn
            ? columns[taskColumn][columns[taskColumn].length - 1].posicion
            : columns[taskColumn][columns[taskColumn].length - 1].posicion + 1
        console.log('ultimo', newPosition)
      } else {
        newPosition = task.posicion + 1
        // (task.posicion + columns[taskColumn][taskIndex + 1].posicion) / 2
        console.log('la nueva posicion es:', newPosition)
      }
    }
    // console.log(newPosition)

    if (darggingTask && (newPosition || newPosition === 0)) {
      //Actualilzacion optimista del estado
      set((state) => {
        const updatedTask = { ...darggingTask, estado: taskColumn }
        // Filtrar la columna anterior para eliminar la tarea
        const prevColumn = state.columns[darggingTask.estado].filter(
          (item) => item.id !== darggingTask.id
        )

        for (let task of prevColumn) {
          if (task.posicion > darggingTask.posicion) {
            task.posicion -= 1
          }
        }

        // Crear una nueva columna destino con la tarea actualizada al final
        let targetColumn = state.columns[taskColumn]

        for (let task of targetColumn) {
          if (task.posicion >= newPosition) {
            task.posicion += 1
          }
        }

        targetColumn = [
          ...targetColumn,
          { ...updatedTask, posicion: newPosition }
        ]

        // Retornar el nuevo estado con ambas columnas actualizadas
        if (darggingTask.estado !== taskColumn) {
          return {
            columns: {
              ...state.columns,
              [darggingTask.estado]: prevColumn,
              [taskColumn]: targetColumn.sort((a, b) => a.posicion - b.posicion) // Orden explícito
            }
          }
        } else {
          return {
            columns: {
              ...state.columns,
              [taskColumn]: [
                ...prevColumn,
                { ...updatedTask, posicion: newPosition }
              ].sort((a, b) => a.posicion - b.posicion)
            }
          }
        }
      })

      console.log(columns)

      try {
        const form = {
          idTarea: darggingTask.id,
          nuevoEstado: taskColumn,
          nuevaPosicion: newPosition
        }

        const response = await helpHTTP().post(endPoints.tasks.move, {
          body: form
        })
        if (JSON.stringify(response).includes('Error')) throw response
      } catch (error) {
        console.error(`Move Task Error: ${error}`)
        //Volver al estado anterior
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
