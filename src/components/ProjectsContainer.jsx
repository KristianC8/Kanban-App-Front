import { useEffect } from 'react'
import { ProjectCard } from './ProjectCard'
import { useProjectsContext } from '../hooks/useProjectsContext'

export const ProjectsContainer = () => {
  const { projects, isLoading, getNewProjects } = useProjectsContext()

  useEffect(() => {
    getNewProjects()
    console.log(projects)
  }, [])

  return (
    <div className='projects-container grid grid-cols-[repeat(auto-fill,minmax(var(--width-card),_1fr))] gap-x-6 gap-y-4'>
      {isLoading ? (
        <p>cargando...</p>
      ) : projects && projects.length === 0 ? (
        <p>No hay proyectos</p>
      ) : (
        projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.nombreProyecto}
            description={project.descripciónProyecto}
          />
        ))
      )}
    </div>
  )
}
