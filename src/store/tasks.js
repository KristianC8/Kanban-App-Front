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
    // Hacemos una copia inmutable del estado
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
      // Actualizar el estado global
      set({ columns: newColumns })
    } else {
      console.error('No se encontró la tarea con el id especificado:', id)
    }
    //  setIsLoading(true)
    try {
      const res = await helpHTTP().put(endPoint, { body: form })
      newColumns[taskColumn][taskIndex] = res // Actualización final con los datos de la API
      set({ columns: newColumns })
      if (JSON.stringify(res).includes('Error')) throw res
    } catch (err) {
      console.error(err)
      // Opcional: revertir al estado anterior si hay un error
      // set({ columns: previousState })
    }
    // finally {
    //   setIsLoading(false)
    // }
  }
}))
