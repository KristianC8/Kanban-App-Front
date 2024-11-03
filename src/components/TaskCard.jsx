import { DeleteIcon } from './icons/DeleteIcon'
import { PopUpConfirm } from './PopUpConfirm'
import { useDelete } from '../hooks/useDelete'

/* eslint-disable react/prop-types */
export const TaskCard = ({ id, title, description, priority, date }) => {
  const getItems = () => {}
  const deleteEndPoint = `http://localhost:8080/kanban-app/tareas/${id}`
  const { isVisible, handleDelete, handleOpen, handleClose } = useDelete(
    deleteEndPoint,
    getItems
  )

  return (
    <article className='bg-[#1a1a1a] p-4 mb-4 relative'>
      <h2 className='font-bold'>{title}</h2>
      <span className='text-sm translate-y-3 text-stone-400'>Descripción:</span>
      <p className='text-sm text-pretty'>{description}</p>
      <div className='flex gap-3 flex-wrap'>
        <label className='text-sm text-stone-400' htmlFor='taskState'>
          Estado:
        </label>
        <select className='bg-transparent text-sm' name='estado' id='taskState'>
          <option className='bg-[#1a1a1a] appearance-none' value='todo'>
            Por hacer
          </option>
          <option className='bg-[#1a1a1a] appearance-none' value='inprogress'>
            En curso
          </option>
          <option className='bg-[#1a1a1a] appearance-none' value='done'>
            Terminado
          </option>
        </select>
      </div>
      <span className='text-sm text-stone-400'>{date}</span>
      <div
        className={`${
          priority === 'low'
            ? 'bg-[var(--low-color)]'
            : priority === 'medium'
              ? 'bg-[--medium-color]'
              : 'bg-[--high-color]'
        } task-priority absolute w-2 top-0 bottom-0 left-0`}
      ></div>
      <div className='flex gap-2'>
        {/* <UpdateProject title={title} description={description} id={id} /> */}
        <button className='' aria-label='Borrar Tarea' onClick={handleOpen}>
          <DeleteIcon />
        </button>
        <PopUpConfirm
          isVisible={isVisible}
          title={'Confirmar'}
          text={'¿Está seguro de eliminar esta tarea?'}
          handleBtnCancel={handleClose}
          handleDelete={handleDelete}
        />
      </div>
    </article>
  )
}
