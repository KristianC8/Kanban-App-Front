import { create } from 'zustand'
import { helpHTTP } from '../helpers/helpHTTP'

export const useProjectsStore = create((set, get) => ({
  projects: null,
  loading: false,
  fetchProjects: async () => {
    set(() => ({ loading: true }))
    try {
      const data = await helpHTTP().get(
        'http://localhost:8080/kanban-app/proyectos'
      )
      if (data.includes('Error')) throw data
      set({ projects: data })
    } catch (error) {
      console.log(error)
    } finally {
      set(() => ({ loading: false }))
    }
  },
  addProject: async (endPoint, form) => {
    set({ loading: true })
    helpHTTP()
      .post(endPoint, {
        body: form
      })
      .then((res) => {
        if (JSON.stringify(res).includes('Error')) throw res
        set((state) => ({ projects: [...state.projects, res] }))
      })
      .catch((err) => console.log(err))
      .finally(set({ loading: false }))
  },

  updateProject: async (endPoint, form, id) => {
    set(() => ({ loading: true }))
    helpHTTP()
      .put(endPoint, {
        body: form
      })
      .then((res) => {
        const { projects } = get()
        const ProjectIndex = projects.findIndex((item) => item.id === id)
        const newProjects = structuredClone(projects)
        newProjects[ProjectIndex] = res
        console.log(projects)
        set({ projects: newProjects })
      })
      .catch((err) => console.log(err))
      .finally(set({ loading: false }))
  },

  deleteProject: async (endPoint, id) => {
    set(() => ({ loading: true }))
    helpHTTP()
      .del(endPoint)
      .then(() => {
        set((state) => ({
          projects: state.projects.filter((item) => item.id !== id)
        }))
      })
      .catch((err) => console.log(err))
      .finally(set({ loading: false }))
  }
}))
