// import { useLoaderData } from 'react-router-dom'
import { useEffect } from 'react'
import { KanbanBoard } from '../components/KanbanBoard'
// import { useTasksContext } from '../hooks/useTasksContext'
import { useParams } from 'react-router-dom'
import { useTasksStore } from '../store/tasks'

export const ProjectKanbanPage = () => {
  // const project = useLoaderData()
  const project = useTasksStore((state) => state.project)
  const getProject = useTasksStore((state) => state.getProject)
  const loadingProject = useTasksStore((state) => state.loadingProject)
  const { id } = useParams()

  useEffect(() => {
    getProject(id)
  }, [id])

  return (
    <>
      {loadingProject ? (
        <p>cargando...</p>
      ) : project === null ? (
        <p>No fue posilbe acceder a la API</p>
      ) : (
        <>
          <h2 className='text-xl font-bold text-[var(--principal-color)] mb-4'>
            {project.nombreProyecto.toUpperCase()}
          </h2>
          <KanbanBoard />
        </>
      )}
    </>
  )
}
