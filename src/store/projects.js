import { create } from 'zustand'
import { helpHTTP } from '../helpers/helpHTTP'
import endPoints from '../api/endpoints'

export const useProjectsStore = create((set, get) => ({
  projects: null,
  loadingFetch: false,
  loadingCreate: false,
  fetchProjects: async () => {
    set(() => ({ loadingFetch: true }))
    try {
      const data = await helpHTTP().get(endPoints.projects.listAll)
      if (data.includes('Error')) throw data
      set({ projects: data })
    } catch (error) {
      console.log(error)
    } finally {
      set(() => ({ loadingFetch: false }))
    }
  },

  addProject: async (endPoint, form) => {
    set(() => ({ loadingCreate: true }))
    try {
      const newProject = await helpHTTP().post(endPoint, {
        body: form
      })
      if (JSON.stringify(newProject).includes('Error')) throw newProject
      set((state) => ({ projects: [...state.projects, newProject] }))
    } catch (error) {
      console.log(error)
    } finally {
      set(() => ({ loadingCreate: false }))
    }
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
