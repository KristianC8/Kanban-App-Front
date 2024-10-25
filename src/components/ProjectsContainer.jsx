import { useEffect, useState } from 'react'
import { ProjectCard } from './ProjectCard'

export const ProjectsContainer = () => {
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

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <div className='projects-container grid grid-cols-[repeat(auto-fill,minmax(var(--width-card),_1fr))] gap-x-6 gap-y-4'>
      {!projects ? (
        <p>Cargando...</p>
      ) : (
        projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.nombreProyecto}
            description={project.descripciónProyecto}
          />
        ))
      )}
    </div>
  )
}
