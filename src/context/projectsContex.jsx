import { createContext, useState } from 'react'
import { helpHTTP } from '../helpers/helpHTTP'

export const ProjectsContext = createContext()

// eslint-disable-next-line react/prop-types
export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const getProjects = async () => {
    setIsLoading(true)
    try {
      const data = await helpHTTP().get(
        'http://localhost:8080/kanban-app/proyectos'
      )
      if (data.includes('Error')) throw data
      setProjects(data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const addProject = async (endPoint, form) => {
    setIsLoading(true)
    helpHTTP()
      .post(endPoint, {
        body: form
      })
      .then((res) => {
        if (JSON.stringify(res).includes('Error')) throw res
        setProjects((prevProjects) => [...prevProjects, res])
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }

  const updateProject = async (endPoint, form, id) => {
    setIsLoading(true)
    helpHTTP()
      .put(endPoint, {
        body: form
      })
      .then((res) => {
        const ProjectIndex = projects.findIndex((item) => item.id === id)
        const newProjects = structuredClone(projects)
        newProjects[ProjectIndex] = res
        setProjects(newProjects)
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }

  const deleteProject = async (endPoint, id) => {
    setIsLoading(true)
    helpHTTP()
      .del(endPoint)
      .then(() => {
        setProjects((prevProjects) =>
          prevProjects.filter((item) => item.id !== id)
        )
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isLoading,
        getProjects,
        addProject,
        updateProject,
        deleteProject
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}
