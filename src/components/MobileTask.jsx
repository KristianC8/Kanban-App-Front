/* eslint-disable react/prop-types */
import { useState } from 'react'
import { GoToIcon } from './icons/GoToIcon'
import { CloseIcon } from './icons/CloseIcon'

export const MobileTask = ({ title, description, state, priority, date }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }
  return (
    <>
      <button
        onClick={handleClick}
        className='flex sm:hidden items-center gap-1 ml-auto mr-0 px-2 rounded-md border border-[#141414] mt-1'
      >
        Ver <GoToIcon />
      </button>
      <article
        className={`${isOpen ? 'flex' : 'hidden'} fixed top-0 left-0 w-full h-screen md:h-screen
         bg-[#242424] backdrop-blur-sm bg-opacity-50 justify-center items-center z-30`}
      >
        <dialog
          className='relative w-4/5 md:w-96 animate-fade p-10 shadow-lg
        flex flex-col gap-4 rounded-md bg-[#212121] z-30'
        >
          <h3 className='self-center text-[var(--principal-color)] text-xl font-bold'>
            {title}
          </h3>
          <div>
            <span className='text-sm translate-y-3 text-stone-400'>
              Descripción:
            </span>
            <p className='text-pretty'>{description}</p>
          </div>
          <div>
            <span className='text-sm text-stone-400'>Estado: </span>
            <span>{`${state === 'todo' ? 'Por Hacer' : state === 'inProgress' ? 'En Curso' : 'Terminado'}`}</span>
          </div>
          <div>
            <span className='text-sm text-stone-400'>Prioridad: </span>
            <div className='inline-flex gap-1 items-center'>
              <span>{`${priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}`}</span>{' '}
              <div
                className={`${
                  priority === 'low'
                    ? 'bg-[var(--low-color)]'
                    : priority === 'medium'
                      ? 'bg-[--medium-color]'
                      : 'bg-[--high-color]'
                } h-4 w-1 rounded-full`}
              ></div>
            </div>
          </div>
          <div>
            <span className='text-sm text-stone-400'>Fecha: </span>
            <span>{date}</span>
          </div>
          <button onClick={handleClick} className='absolute top-4 right-4'>
            <CloseIcon />
          </button>
        </dialog>
      </article>
    </>
  )
}
