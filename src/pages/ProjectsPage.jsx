import React from 'react'
import { CreateProject } from '../components/CreateProject'
import { ProjectsContainer } from '../components/ProjectsContainer'

export const ProjectsPage = () => {
  return (
    <>
      <h2 className='text-xl font-bold text-[var(--principal-color)] mb-4'>
        PROYECTOS
      </h2>
      <CreateProject />
      <ProjectsContainer />
    </>
  )
}
