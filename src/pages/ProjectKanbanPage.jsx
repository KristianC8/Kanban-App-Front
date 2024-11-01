// import { useLoaderData } from 'react-router-dom'
import { useEffect } from 'react'
import { KanbanBoard } from '../components/KanbanBoard'
import { useTasksContext } from '../hooks/useTasksContext'
import { useParams } from 'react-router-dom'

export const ProjectKanbanPage = () => {
  // const project = useLoaderData()
  const { project, getProject, isLoading } = useTasksContext()
  const { id } = useParams()

  useEffect(() => {
    getProject(id)
  }, [id])

  return (
    <>
      {isLoading ? (
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
