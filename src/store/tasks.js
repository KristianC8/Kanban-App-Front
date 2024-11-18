import { create } from 'zustand'
import { helpHTTP } from '../helpers/helpHTTP'

export const useTasksStore = create((set) => ({
  project: null,
  darggingTask: null,
  loading: false,
  columns: {
    todo: [],
    inProgress: [],
    done: []
  },
  getProject: async (id) => {
    set({ loading: true })
    try {
      const data = await helpHTTP().get(
        `http://localhost:8080/kanban-app/proyectos/${id}`
      )
      if (JSON.stringify(data).includes('Error')) throw data
      set({ project: data })
    } catch (error) {
      console.log(error)
    } finally {
      set({ loading: false })
    }
  },
  getTasks: async (id) => {
    set({ loading: true })
    try {
      const data = await helpHTTP().get(
        `http://localhost:8080/kanban-app/tareas/${id}`
      )
      if (JSON.stringify(data).includes('Error')) throw data
      set({
        columns: {
          todo: data.filter((task) => task.estado === 'todo'),
          inProgress: data.filter((task) => task.estado === 'inProgress'),
          done: data.filter((task) => task.estado === 'done')
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      set({ loading: false })
    }
  }
}))
