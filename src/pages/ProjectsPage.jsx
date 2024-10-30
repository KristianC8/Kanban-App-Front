import React from 'react'
import { CreateProject } from '../components/CreateProject'
import { ProjectsContainer } from '../components/ProjectsContainer'

export const ProjectsPage = () => {
  return (
    <>
      <CreateProject />
      <h2 className='text-xl font-bold text-[#f74c3c] mb-4'>PORYECTOS</h2>
      <ProjectsContainer />
    </>
  )
}
