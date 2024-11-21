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
  // getTasks: async (id) => {
  //   set({ loading: true })
  //   try {
  //     const data = await helpHTTP().get(
  //       `http://localhost:8080/kanban-app/tareas/${id}`
  //     )
  //     if (JSON.stringify(data).includes('Error')) throw data
  //     set({
  //       columns: {
  //         todo: data.filter((task) => task.estado === 'todo'),
  //         inProgress: data.filter((task) => task.estado === 'inProgress'),
  //         done: data.filter((task) => task.estado === 'done')
  //       }
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     set({ loading: false })
  //   }
  // },
  addTask: async (endPoint, form) => {
    set({ loadingTask: true })

    const { columns } = get()
    form.posicion = columns.todo.length + 1

    helpHTTP()
      .post(endPoint, {
        body: form
      })
      .then((res) => {
        if (JSON.stringify(res).includes('Error')) throw res
        set((state) => ({
          columns: {
            todo: [...state.columns.todo, res],
            inProgress: [...state.columns.inProgress],
            done: [...state.columns.done]
          }
        }))
      })
      .catch((err) => console.log(err))
      .finally(() => set({ loadingTask: false }))
  },
  deleteTask: async (endPoint, id) => {
    helpHTTP()
      .del(endPoint)
      .then((res) => {
        if (JSON.stringify(res).includes('Error')) throw res
        const { columns } = get()
        const newColumns = structuredClone(columns)

        for (let column in newColumns) {
          newColumns[column] = columns[column].filter((item) => item.id !== id)
        }

        set({ columns: newColumns })
      })
      .catch((err) => console.log(err))
  },
  updateTask: async (endPoint, form, id) => {
    let taskColumn = null
    let taskIndex = null
    const { columns } = get()
    form.posicion = columns[form.estado].length + 1

    //copia inmutable del estado
    const newColumns = structuredClone(columns)
    // Buscar la tarea y la columna correspondiente
    for (let column in newColumns) {
      const index = newColumns[column].findIndex((item) => item.id === id)
      if (index !== -1) {
        taskColumn = column
        taskIndex = index
        break
      }
    }

    // Validamos si se encontró la tarea antes de continuar
    if (taskColumn !== null && taskIndex !== null) {
      // Actualización optimista con los datos locales
      newColumns[taskColumn][taskIndex] = form
      // si cambia el estado eliminamos la tarea de la columna actual
      if (form.estado !== taskColumn) {
        newColumns[taskColumn] = newColumns[taskColumn].filter(
          (item) => item.id !== id
        )
        //Agregamos la tarea a la columna del nuevo estado
        const newStateColumn = form.estado
        newColumns[newStateColumn] = [...newColumns[newStateColumn], form]
      }
      // Actualizar el estado global
      set({ columns: newColumns })
    } else {
      console.error('No se encontró la tarea con el id especificado:', id)
    }

    //  setIsLoading(true)
    try {
      const res = await helpHTTP().put(endPoint, { body: form })
      // newColumns[taskColumn][taskIndex] = res // Actualización final con los datos de la API
      // setProject(() => newProject)
      if (JSON.stringify(res).includes('Error')) throw res
    } catch (err) {
      console.error(err)
      // Opcional: revertir al estado anterior si hay un error
      // set({ columns: previousState })
    }
    // finally {
    //   setIsLoading(false)
    // }
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
