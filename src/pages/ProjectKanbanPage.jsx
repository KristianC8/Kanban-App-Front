import { useLoaderData } from 'react-router-dom'
import { KanbanBoard } from '../components/KanbanBoard'

export const ProjectKanbanPage = () => {
  const project = useLoaderData()
  return (
    <>
      {project === null ? (
        <p>Error al acceder a la API</p>
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
