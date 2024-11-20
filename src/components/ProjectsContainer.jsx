import { useEffect } from 'react'
import { ProjectCard } from './ProjectCard'
import { useProjectsStore } from '../store/projects'

export const ProjectsContainer = () => {
  const projects = useProjectsStore((state) => state.projects)
  const getProjects = useProjectsStore((state) => state.fetchProjects)
  const isLoading = useProjectsStore((state) => state.loading)

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <div className='projects-container flex flex-col gap-4 sm:grid sm:grid-cols-[repeat(2,minmax(200px,_1fr))]  lg:grid-cols-[repeat(auto-fill,minmax(var(--width-card),_1fr))] gap-x-6 gap-y-4'>
      {isLoading ? (
        <p>cargando...</p>
      ) : projects === null ? (
        <p>No fue posilbe acceder a la API</p>
      ) : projects.length === 0 ? (
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
