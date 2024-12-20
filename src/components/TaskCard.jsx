import { DeleteIcon } from './icons/DeleteIcon'
import { PopUpConfirm } from './PopUpConfirm'
import { useConfirm } from '../hooks/useConfirm'
import { useState } from 'react'
import { UpdateTask } from './UpdateTask'
import { useTasksStore } from '../store/tasks'

/* eslint-disable react/prop-types */
export const TaskCard = ({
  id,
  title,
  description,
  state,
  priority,
  date,
  position
}) => {
  const deleteTask = useTasksStore((state) => state.deleteTask)
  const updateStateTask = useTasksStore((state) => state.updateStateTask)
  const [stateTask, setStateTask] = useState(state)
  const dragStart = useTasksStore((state) => state.dragStart)
  const onDropCard = useTasksStore((state) => state.onDropCard)

  const handleChangeSelect = (e) => {
    const form = {
      estado: e.target.value
    }
    setStateTask(e.target.value)
    handleSubmit(e, form)
  }

  const handleSubmit = (e, form) => {
    e.preventDefault()
    const updateStateEndpoint = `http://localhost:8080/kanban-app/estado/tareas/${id}`
    updateStateTask(updateStateEndpoint, form, id)
  }

  const handleDelete = () => {
    const deleteEndPoint = `http://localhost:8080/kanban-app/tareas/${id}`
    deleteTask(deleteEndPoint, id).then(() => handleClose())
  }

  const { isVisible, handleOpen, handleClose } = useConfirm()

  return (
    <article
      className='cardTask bg-[var(--card-color)] p-4 mb-1 relative animate-fade transition-all duration-500'
      draggable
      id={id}
      data-position={position}
      onDragStart={() => {
        dragStart(id)
      }}
    >
      <h2 className=' font-bold'>{title}</h2>
      <span className=' text-sm translate-y-3 text-stone-400'>
        Descripción:
      </span>
      <p className=' text-sm text-pretty'>{description}</p>
      <form className=' flex md:gap-3 flex-wrap'>
        <label className=' text-sm text-stone-400' htmlFor='taskState'>
          Estado:
        </label>
        <select
          className=' bg-transparent text-sm z-[1]'
          name='estado'
          id='taskState'
          defaultValue={stateTask}
          onChange={handleChangeSelect}
          disabled={state === 'done'}
        >
          <option
            className={`${state === 'todo' || state === 'inProgress' || state === 'done' ? 'hidden' : 'block'} bg-[var(--card-color)] appearance-none'`}
            value='todo'
          >
            Por hacer
          </option>
          <option
            className={`${state === 'inProgress' || state === 'done' ? 'hidden' : 'block'} bg-[var(--card-color)] appearance-none'`}
            value='inProgress'
          >
            En curso
          </option>
          <option
            className={`${state === 'todo' ? 'hidden' : 'block'} bg-[var(--card-color)] appearance-none`}
            value='done'
          >
            Terminado
          </option>
        </select>
      </form>
      <div className='flex gap-2 items-center'>
        <span className='text-sm text-stone-400'>Prioridad: </span>
        <span className='text-sm '>
          {`${
            priority === 'low'
              ? 'Baja'
              : priority === 'medium'
                ? 'Media'
                : 'Alta'
          }`}
        </span>{' '}
        <div
          className={`${
            priority === 'low'
              ? 'bg-[var(--low-color)]'
              : priority === 'medium'
                ? 'bg-[--medium-color]'
                : 'bg-[--high-color]'
          } h-3 w-1 rounded-full`}
        ></div>
      </div>
      <span className=' text-sm text-stone-400'>{date}</span>
      <div
        className={`${
          state === 'todo'
            ? 'bg-[var(--todo-color)]'
            : state === 'inProgress'
              ? 'bg-[--inProgress-color]'
              : 'bg-[--done-color]'
        }  task-priority absolute w-[2px] top-2 bottom-2 left-1 rounded-full`}
      ></div>
      <div
        // className='cardUp absolute top-0 left-0 right-0 h-1/2 bg-blue-400 '
        className='cardUp absolute top-0 left-0 right-0 h-1/2 '
        onDrop={onDropCard}
      ></div>
      <div
        // className='cardDown absolute bottom-[-4px] left-0 right-0 h-1/2 bg-green-300 '
        className='cardDown absolute bottom-[-4px] left-0 right-0 h-1/2 '
        onDrop={onDropCard}
      ></div>
      <div
        className={`${state === 'done' ? 'hidden' : 'block'} absolute bottom-4 right-4 flex gap-2`}
      >
        <div className='flex items-center'>
          <UpdateTask
            id={id}
            title={title}
            description={description}
            state={state}
            priority={priority}
            date={date}
          />
        </div>
        <button
          className={`${state === 'inProgress' ? 'hidden' : 'block'}`}
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
