import { createContext, useState } from 'react'
import { helpHTTP } from '../helpers/helpHTTP'

export const ProjectsContext = createContext()

// eslint-disable-next-line react/prop-types
export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getNewProjects = async () => {
    setIsLoading(true)
    try {
      const data = await helpHTTP().get(
        'http://localhost:8080/kanban-app/proyectos'
      )
      setProjects(data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProjectsContext.Provider value={{ projects, isLoading, getNewProjects }}>
      {children}
    </ProjectsContext.Provider>
  )
}
