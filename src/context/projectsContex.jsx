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
    helpHTTP()
      .post(endPoint, {
        body: form
      })
      .then((res) => {
        if (JSON.stringify(res).includes('Error')) throw res
        setProjects((prevProjects) => [...prevProjects, res])
      })
      .catch((err) => console.log(err))
  }

  return (
    <ProjectsContext.Provider
      value={{ projects, isLoading, getProjects, addProject }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}
