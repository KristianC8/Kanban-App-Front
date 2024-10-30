import React from 'react'
import { useState } from 'react'
import { DeleteIcon } from './icons/DeleteIcon'
import { GetInIcon } from './icons/GetInIcon'
import { helpHTTP } from '../helpers/helpHTTP'
import { useProjectsContext } from '../hooks/useProjectsContext'
import { UpdateProject } from './UpdateProject'
import { PopUpConfirm } from './PopUpConfirm'
import { Link } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
export const ProjectCard = ({ title, description, id }) => {
  const { getNewProjects } = useProjectsContext()
  const [isVisible, setIsVisible] = useState(false)

  const handleDelete = () => {
    const deleteEndPoint = `http://localhost:8080/kanban-app/proyectos/${id}`
    helpHTTP()
      .del(deleteEndPoint)
      .then(() => {
        getNewProjects()
        setIsVisible(false)
      })
  }

  const handleBtnCancel = () => {
    setIsVisible(false)
  }

  return (
    <article className='w-full p-4 flex flex-col gap-2 rounded-md bg-[#1a1a1a] hover:shadow-md hover:shadow-[#f74c3c] transition-all duration-500'>
      <h2 className='text-xl font-semibold'>{title}</h2>
      <div className='bg-custom-gradient h-[1px] my-2'></div>
      <h5 className='text-base font-semibold text-[#989898]'>Descripción:</h5>
      <p>{description}</p>
      <div className='flex justify-between'>
        <Link
          to={`/projects/${id}`}
          className='flex items-center gap-2 bg-[#f74c3c] p-1 rounded-md'
        >
          Ver <GetInIcon />
        </Link>
        <div className='flex gap-2'>
          <UpdateProject title={title} description={description} id={id} />
          <button
            aria-label='Borrar Proyecto'
            onClick={() => {
              setIsVisible(true)
            }}
          >
            <DeleteIcon />
          </button>
          <PopUpConfirm
            isVisible={isVisible}
            title={'Confirmación'}
            text={'Está seguro de eliminar el proyecto?'}
            handleBtnCancel={handleBtnCancel}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </article>
  )
}
