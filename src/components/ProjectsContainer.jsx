import { useEffect } from 'react'
import { ProjectCard } from './ProjectCard'
import { useGetProjects } from '../hooks/useGetProjects'

export const ProjectsContainer = () => {
  const { projects, getProjects } = useGetProjects()

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <div className='projects-container grid grid-cols-[repeat(auto-fill,minmax(var(--width-card),_1fr))] gap-x-6 gap-y-4'>
      {!projects ? (
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
