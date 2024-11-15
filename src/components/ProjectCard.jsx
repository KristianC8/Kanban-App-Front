import React from 'react'
// import { useState } from 'react'
import { DeleteIcon } from './icons/DeleteIcon'
import { GetInIcon } from './icons/GetInIcon'
// import { helpHTTP } from '../helpers/helpHTTP'
// import { useProjectsContext } from '../hooks/useProjectsContext'
import { UpdateProject } from './UpdateProject'
import { PopUpConfirm } from './PopUpConfirm'
// import { Link } from 'react-router-dom'
import { useTasksContext } from '../hooks/useTasksContext'
import { useNavigate } from 'react-router-dom'
import { useConfirm } from '../hooks/useConfirm'
import { useProjectsStore } from '../store/projects'

// eslint-disable-next-line react/prop-types
export const ProjectCard = ({ title, description, id }) => {
  // const { deleteProject } = useProjectsContext()
  const deleteProject = useProjectsStore((state) => state.deleteProject)

  const { isVisible, handleOpen, handleClose } = useConfirm()

  const handleDelete = () => {
    const deleteEndPoint = `http://localhost:8080/kanban-app/proyectos/${id}`
    deleteProject(deleteEndPoint, id).then(() => handleClose())
  }

  const { getProject } = useTasksContext()
  const navigate = useNavigate()

  const cambiarPage = (id) => {
    navigate(`/projects/${id}`)
    getProject(id)
  }

  return (
    <article className='w-full p-4 flex flex-col justify-between gap-2 rounded-md bg-[#1a1a1a] hover:shadow-md hover:shadow-[var(--principal-color)] transition-all duration-500 animate-fade'>
      <div>
        <h2 className='text-xl font-semibold'>{title}</h2>
        <div className='bg-custom-gradient h-[1px] my-2'></div>
      </div>
      <div>
        <h5 className='text-base font-semibold text-[#989898]'>Descripción:</h5>
        <p>{description}</p>
      </div>
      <div className='flex justify-between'>
        {/* <Link
          to={`/projects/${id}`}
          className='flex items-center gap-2 bg-[var(--principal-color)] p-1 rounded-md'
        >
          Ver <GetInIcon />
        </Link> */}
        <button
          onClick={() => {
            cambiarPage(id)
          }}
          className='flex items-center gap-2 bg-[var(--principal-color)] p-1 rounded-md'
        >
          Ver <GetInIcon />
        </button>
        <div className='flex gap-2'>
          <UpdateProject title={title} description={description} id={id} />
          <button aria-label='Borrar Proyecto' onClick={handleOpen}>
            <DeleteIcon />
          </button>
          <PopUpConfirm
            isVisible={isVisible}
            title={'Confirmar'}
            text={'¿Está seguro de eliminar el proyecto?'}
            handleBtnCancel={handleClose}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </article>
  )
}
