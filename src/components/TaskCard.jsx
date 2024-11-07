import { DeleteIcon } from './icons/DeleteIcon'
import { PopUpConfirm } from './PopUpConfirm'
import { useConfirm } from '../hooks/useConfirm'
import { useTasksContext } from '../hooks/useTasksContext'
import { useState } from 'react'
import { UpdateTask } from './UpdateTask'
import { useDragContext } from '../hooks/useDragContext'

/* eslint-disable react/prop-types */
export const TaskCard = ({ id, title, description, state, priority, date }) => {
  const { deleteTask, updateTask } = useTasksContext()
  const [stateTask, setStateTask] = useState(state)

  const handleChangeSelect = (e) => {
    const form = {
      titulo: title,
      descripcion: description,
      estado: e.target.value,
      prioridad: priority,
      fechaPendiente: date
    }
    setStateTask(e.target.value)
    handleSubmit(e, form)
  }

  const handleSubmit = (e, form) => {
    e.preventDefault()
    const updateEndpoint = `http://localhost:8080/kanban-app/tareas/${id}`

    console.log(form)
    updateTask(updateEndpoint, form, id)
  }

  const handleDelete = () => {
    const deleteEndPoint = `http://localhost:8080/kanban-app/tareas/${id}`
    deleteTask(deleteEndPoint, id).then(() => handleClose())
  }
  const { isVisible, handleOpen, handleClose } = useConfirm()

  const { handleDragStart, handleDragEnd, handleDrop, handleDragOver } =
    useDragContext()

  return (
    <article
      className='cardTask cardTask bg-[#1a1a1a] p-4 mb-4 relative animate-fade'
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2 className='cardTask font-bold'>{title}</h2>
      <span className='cardTask text-sm translate-y-3 text-stone-400'>
        Descripción:
      </span>
      <p className='cardTask text-sm text-pretty'>{description}</p>
      <form className='cardTask flex md:gap-3 flex-wrap'>
        <label className='cardTask text-sm text-stone-400' htmlFor='taskState'>
          Estado:
        </label>
        <select
          className='cardTask bg-transparent text-sm'
          name='estado'
          id='taskState'
          defaultValue={stateTask}
          onChange={handleChangeSelect}
        >
          <option
            className='cardTask bg-[#1a1a1a] appearance-none'
            value='todo'
          >
            Por hacer
          </option>
          <option
            className='cardTask bg-[#1a1a1a] appearance-none'
            value='inProgress'
          >
            En curso
          </option>
          <option
            className='cardTask bg-[#1a1a1a] appearance-none'
            value='done'
          >
            Terminado
          </option>
        </select>
      </form>
      <span className='cardTask text-sm text-stone-400'>{date}</span>
      <div
        className={`${
          priority === 'low'
            ? 'bg-[var(--low-color)]'
            : priority === 'medium'
              ? 'bg-[--medium-color]'
              : 'bg-[--high-color]'
        } cardTask task-priority absolute w-2 top-0 bottom-0 left-0`}
      ></div>
      <div className='cardTask flex gap-2'>
        <UpdateTask
          id={id}
          title={title}
          description={description}
          state={state}
          priority={priority}
          date={date}
        />
        <button
          className='cardTask '
          aria-label='Borrar Tarea'
          onClick={handleOpen}
        >
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
