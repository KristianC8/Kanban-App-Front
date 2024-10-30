/* eslint-disable react/prop-types */
import React from 'react'

export const PopUpConfirm = ({
  title,
  text,
  handleDelete,
  isVisible,
  handleBtnCancel
}) => {
  return (
    <article
      className={`${isVisible ? 'block' : 'hidden'} fixed top-0 left-0 w-full h-screen md:h-screen z-30 bg-[#242424] backdrop-blur-sm bg-opacity-50 flex justify-center items-center`}
    >
      <dialog
        className='relative w-4/5 md:w-96 animate-fade p-10 shadow-lg
        flex flex-col gap-4 rounded-md bg-[#212121]'
      >
        <h3 className='self-center text-xl text-[#e42f1e] font-bold'>
          {title}
        </h3>
        <p className='text-center'>{text}</p>
        <div className='flex gap-4 justify-center'>
          <button
            type='button'
            className='px-4 py-2 bg-primary rounded '
            onClick={handleBtnCancel}
          >
            Cancelar
          </button>
          <button
            type='button'
            className='px-4 py-2 bg-primary rounded bg-[#e42f1e] disabled:bg-[#5b130c]'
            onClick={handleDelete}
          >
            Aceptar
          </button>
        </div>
      </dialog>
    </article>
  )
}
