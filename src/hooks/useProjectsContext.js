import { useContext } from 'react'
import { ProjectsContext } from '../context/projectsContex'

export const useProjectsContext = () => {
  const ProjectsContextValues = useContext(ProjectsContext)

  if (ProjectsContextValues === undefined) {
    throw new Error('UseProjectsContext no puede usarse sin un Provider')
  }

  return ProjectsContextValues
}
