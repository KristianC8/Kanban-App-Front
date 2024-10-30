import { useLoaderData } from 'react-router-dom'

export const ProjectKanbanPage = () => {
  const project = useLoaderData()
  return (
    <>
      {project === null ? (
        <p>Error al acceder a la API</p>
      ) : (
        <h2 className='text-xl font-bold text-[#f74c3c] mb-4'>
          {project.nombreProyecto.toUpperCase()}
        </h2>
      )}
    </>
  )
}
