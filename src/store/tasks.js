import { create } from 'zustand'
import { helpHTTP } from '../helpers/helpHTTP'

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
      const taskColumn = Object.keys(columns).find((column) =>
        columns[column].some((item) => item.id === id)
      )

      //Validar si se encuentra la tarea
      if (!taskColumn) {
        console.error('No se encontró la tarea con el id:', id)
        return
      }

      const taskIndex = columns[taskColumn].findIndex((item) => item.id === id)
      if (taskIndex === -1) {
        console.error(
          'No se encontró el índice de la tarea en la columna:',
          taskColumn
        )
        return
      }

      const position =
        form.estado === taskColumn
          ? columns[taskColumn][taskIndex].posicion // Mantener la posición original
          : columns[form.estado].length + 1 //Asignar la posicion final en la columna

      // Actualizar la posición de la tarea en la nueva columna
      const updatedTask = { ...form, posicion: position }

      const response = await helpHTTP().put(endPoint, { body: updatedTask })
      if (JSON.stringify(response).includes('Error')) throw response

      set((state) => {
        const { columns } = state

        //Si no cambie el estado se actualiza la tarea
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
    let taskState = null
    let taskIndex = null
    let task = null
    const { columns } = get()
    form.posicion = columns[form.estado].length + 1
    //copia inmutable del estado
    const newColumns = structuredClone(columns)
    for (let column in newColumns) {
      const index = newColumns[column].findIndex((item) => item.id === id)
      if (index !== -1) {
        taskState = column
        taskIndex = index
        break
      }
    }
    // Validamos si se encontró la tarea antes de continuar
    if (taskState !== null && taskIndex !== null) {
      // Actualización optimista con los datos locales
      task = newColumns[taskState][taskIndex]
      task.posicion = columns[form.estado].length + 1
      // si cambia el estado eliminamos la tarea de la columna actual
      if (form.estado !== taskState) {
        task.estado = form.estado
        newColumns[taskState] = newColumns[taskState].filter(
          (item) => item.id !== id
        )
        //Agregamos la tarea a la columna del nuevo estado
        const newStateColumn = form.estado
        newColumns[newStateColumn] = [...newColumns[newStateColumn], task]
      }
      // Actualizar el estado global
      set({ columns: newColumns })
    } else {
      console.error('No se encontró la tarea con el id especificado:', id)
    }

    try {
      const res = await helpHTTP().patch(endPoint, { body: form })
      if (JSON.stringify(res).includes('Error')) throw res
    } catch (err) {
      console.error(err)
      // Opcional: revertir al estado anterior si hay un error
      // set({ columns: previousState })
    }
  },

  dragStart: (id) => {
    // e.preventDefault()
    // let taskId = e.target.id
    let taskState = null
    let taskIndex = null
    let task = null
    const { columns } = get()
    //copia inmutable del estado
    const newColumns = structuredClone(columns)
    for (let column in newColumns) {
      const index = newColumns[column].findIndex((item) => item.id === id)
      if (index !== -1) {
        taskState = column
        taskIndex = index
        break
      }
    }
    // Validamos si se encontró la tarea antes de continuar
    if (taskState !== null && taskIndex !== null) {
      // Actualización optimista con los datos locales
      task = newColumns[taskState][taskIndex]
      console.log('start', task)
      // Actualizar el estado global
      set({ darggingTask: task })
    } else {
      console.error('No se encontró la tarea con el id especificado:', id)
    }
  },

  dragEnd: () => {
    set({ darggingTask: null })
  },

  onDrop: async (e) => {
    e.preventDefault()
    const { darggingTask } = get()
    const { columns } = get()
    const newColumns = structuredClone(columns)
    const newDragTask = { ...darggingTask }
    const form = {}
    if (darggingTask) {
      if (e.target.classList.contains('kanban-todo')) {
        if (darggingTask.estado !== 'todo') {
          form.estado = 'todo'
          form.posicion = columns.todo.length + 1
          //eliminar de la columna de estado actual
          newColumns[darggingTask.estado] = newColumns[
            darggingTask.estado
          ].filter((item) => item.id !== darggingTask.id)
          //Agregamos la tarea a la columna del nuevo estado
          newDragTask.estado = 'todo'
          newColumns['todo'] = [...newColumns['todo'], newDragTask]
        }
      } else if (e.target.classList.contains('kanban-inprogress')) {
        if (darggingTask.estado !== 'inProgress') {
          form.estado = 'inProgress'
          form.posicion = columns.inProgress.length + 1
          //eliminar de la columna de estado actual
          newColumns[darggingTask.estado] = newColumns[
            darggingTask.estado
          ].filter((item) => item.id !== darggingTask.id)
          //Agregamos la tarea a la columna del nuevo estado
          newDragTask.estado = 'inProgress'
          newColumns['inProgress'] = [...newColumns['inProgress'], newDragTask]
        }
      } else if (e.target.classList.contains('kanban-done')) {
        if (darggingTask.estado !== 'done') {
          form.estado = 'done'
          form.posicion = columns.done.length + 1
          //eliminar de la columna de estado actual
          newColumns[darggingTask.estado] = newColumns[
            darggingTask.estado
          ].filter((item) => item.id !== darggingTask.id)
          //Agregamos la tarea a la columna del nuevo estado
          newDragTask.estado = 'done'
          newColumns['done'] = [...newColumns['done'], newDragTask]
        }
      }

      set({ columns: newColumns })

      try {
        const res = await helpHTTP().patch(
          `http://localhost:8080/kanban-app/estado/tareas/${darggingTask.id}`,
          { body: form }
        )
        if (JSON.stringify(res).includes('Error')) throw res
      } catch (err) {
        console.error(err)
        // Opcional: revertir al estado anterior si hay un error
        // set({ columns: previousState })
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
