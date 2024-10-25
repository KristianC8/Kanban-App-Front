import React, { useState } from 'react'

export const CreateProject = () => {
  const [isVisible, setIsVisible] = useState(false)

  const handleCreateBtn = () => {
    setIsVisible(!isVisible)
  }

  const handleCancelBtn = () => {
    setIsVisible(false)
  }

  return (
    <>
      <button
        className='p-3 bg-gradient-to-r from-[#e42f1e] to-[#fe786b] mb-4 rounded-md font-bold'
        onClick={handleCreateBtn}
      >
        Crear Proyecto
      </button>
      <article
        className={`${isVisible ? 'block' : 'hidden'} fixed top-0 left-0 w-full h-screen md:h-screen z-30 bg-[#242424] backdrop-blur-sm bg-opacity-50 flex justify-center items-center`}
      >
        <dialog
          className='relative w-4/5 md:w-96 animate-fade p-10 shadow-lg
        flex flex-col gap-4 rounded-md bg-[#212121]'
        >
          <h3 className='self-center'>Crear Proyecto</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
            className='flex flex-col gap-4'
          >
            <div className='flex flex-col gap-1'>
              <label className='' htmlFor='proyecto'>
                Nombre del Proyecto:
              </label>
              <input
                className='rounded-md px-2 py-1 bg-slate-300 text-zinc-800'
                type='text'
                name='proyecto'
                id='proyecto'
                //   value={formData.user}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='' htmlFor='descripcion'>
                Descripción:
              </label>
              <textarea
                className='rounded-md px-2 py-1 bg-slate-300 text-zinc-800 resize-none'
                name='descripcion'
                id='descripcion'
                //   value={formData.password}
              />
            </div>
            <div className='flex gap-4 justify-center'>
              <button
                type='button'
                className='px-4 py-2 bg-primary rounded '
                onClick={handleCancelBtn}
              >
                Cancelar
              </button>
              <button type='submit' className='px-4 py-2 bg-primary rounded'>
                Crear
              </button>
            </div>
          </form>
        </dialog>
      </article>
    </>
  )
}
