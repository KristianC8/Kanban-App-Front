import React from 'react'
import { EditIcon } from './icons/EditIcon'
import { DeleteIcon } from './icons/DeleteIcon'
import { GetIn } from './icons/GetIn'

// eslint-disable-next-line react/prop-types
export const ProjectCard = ({ title, description, id }) => {
  const deleteData = async (endPoint) => {
    try {
      const response = await fetch(endPoint, {
        method: 'DELETE',
        headers: { Accept: 'application/json' }
      })
      if (response.ok) throw `Error al acceder a la API: ${response.status}`
    } catch (error) {
      console.log(error)
    }
  }

  // const handleEdit = () => {
  //   const updateEndPoint = `http://localhost:8080/kanban-app/proyectos/${id}`
  // }

  const handleDelete = () => {
    const deleteEndPoint = `http://localhost:8080/kanban-app/proyectos/${id}`
    deleteData(deleteEndPoint)
  }

  return (
    <article className='w-full p-4 flex flex-col gap-2 rounded-md bg-[#1a1a1a] hover:shadow-md hover:shadow-[#f74c3c] transition-all duration-500'>
      <h2 className='text-xl font-semibold'>{title}</h2>
      <div className='bg-custom-gradient h-[1px] my-2'></div>
      <h5 className='text-base font-semibold text-[#989898]'>Descripción:</h5>
      <p>{description}</p>
      <div className='flex justify-between'>
        <button className='flex items-center gap-2 bg-[#f74c3c] p-1 rounded-md'>
          Ver <GetIn />
        </button>
        <div className='flex gap-2'>
          <button aria-label='Editar Proyecto'>
            <EditIcon />
          </button>
          <button aria-label='Borrar Proyecto' onClick={handleDelete}>
            <DeleteIcon />
          </button>
        </div>
      </div>
    </article>
  )
}
