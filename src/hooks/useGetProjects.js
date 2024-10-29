import { useState } from 'react'

export const useGetProjects = () => {
  const [projects, setProjects] = useState(null)

  const getProjects = async () => {
    try {
      const response = await fetch('http://localhost:8080/kanban-app/proyectos')
      if (!response) throw new Error('No fue posible acceder a la api')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error(error)
    }
  }

  return { projects, getProjects }
}
