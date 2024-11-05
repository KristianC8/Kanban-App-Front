import { createContext, useState } from 'react'
import { helpHTTP } from '../helpers/helpHTTP'
import { useRef } from 'react'

export const TasksContext = createContext()

// eslint-disable-next-line react/prop-types
export const TasksProvider = ({ children }) => {
  const [project, setProject] = useState(null)
  // const [tasks, setTasks] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const scrollPosRef = useRef(0)

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

  const addTask = async (endPoint, form) => {
    scrollPosRef.current = window.scrollY
    setIsLoading(true)
    helpHTTP()
      .post(endPoint, {
        body: form
      })
      .then((res) => {
        if (JSON.stringify(res).includes('Error')) throw res
        setProject((prevProject) => ({
          ...prevProject,
          tareas: [...prevProject.tareas, res]
        }))
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }

  const updateTask = async (endPoint, form, id) => {
    setIsLoading(true)
    helpHTTP()
      .put(endPoint, {
        body: form
      })
      .then((res) => {
        const projectTaskIndex = project.tareas.findIndex(
          (item) => item.id === id
        )
        const newProject = structuredClone(project)
        newProject.tareas[projectTaskIndex] = res
        setProject(newProject)
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }

  const deleteTask = async (endPoint, id) => {
    scrollPosRef.current = window.scrollY
    setIsLoading(true)
    helpHTTP()
      .del(endPoint)
      .then(() => {
        setProject((prevProject) => ({
          ...prevProject,
          tareas: [...prevProject.tareas.filter((item) => item.id !== id)]
        }))
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }

  // const getTasks = async (id) => {
  //   setIsLoading(true)
  //   try {
  //     const data = await helpHTTP().get(
  //       `http://localhost:8080/kanban-app/tareas/${id}`
  //     )
  //     if (JSON.stringify(data).includes('Error')) throw data
  //     setTasks(data)
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <TasksContext.Provider
      value={{
        project,
        isLoading,
        scrollPosRef,
        getProject,
        addTask,
        updateTask,
        deleteTask
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}
