import { createContext, useState } from 'react'
import { helpHTTP } from '../helpers/helpHTTP'

export const TasksContext = createContext()

// eslint-disable-next-line react/prop-types
export const TasksProvider = ({ children }) => {
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const getProject = async (id) => {
    setIsLoading(true)
    try {
      const data = await helpHTTP().get(
        `http://localhost:8080/kanban-app/proyectos/${id}`
      )
      if (JSON.stringify(data).includes('Error')) throw data
      setProject(data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTasks = async (id) => {
    setIsLoading(true)
    try {
      const data = await helpHTTP().get(
        `http://localhost:8080/kanban-app/tareas/${id}`
      )
      if (JSON.stringify(data).includes('Error')) throw data
      setTasks(data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TasksContext.Provider
      value={{ project, tasks, isLoading, getProject, getTasks }}
    >
      {children}
    </TasksContext.Provider>
  )
}
