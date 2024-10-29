/* eslint-disable react/prop-types */
import { useState } from 'react'

export const PopUp = ({
  children,
  stylesBtn,
  title,
  OpenBtn,
  textBtn,
  handleSubmit,
  functionClose
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const handleOpenBtn = () => {
    setIsVisible(!isVisible)
  }

  const handleCancelBtn = () => {
    setIsVisible(false)
    functionClose()
  }

  const handleClosePopup = () => {
    setIsVisible(false)
  }
  return (
    <>
      <button className={stylesBtn} onClick={handleOpenBtn}>
        {OpenBtn}
      </button>
      <article
        className={`${isVisible ? 'block' : 'hidden'} fixed top-0 left-0 w-full h-screen md:h-screen z-30 bg-[#242424] backdrop-blur-sm bg-opacity-50 flex justify-center items-center`}
      >
        <dialog
          className='relative w-4/5 md:w-96 animate-fade p-10 shadow-lg
        flex flex-col gap-4 rounded-md bg-[#212121]'
        >
          <h3 className='self-center text-[#e42f1e]'>{title}</h3>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            {children}
            <div className='flex gap-4 justify-center'>
              <button
                type='button'
                className='px-4 py-2 bg-primary rounded '
                onClick={handleCancelBtn}
              >
                Cancelar
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-primary rounded'
                onClick={handleClosePopup}
              >
                {textBtn}
              </button>
            </div>
          </form>
        </dialog>
      </article>
    </>
  )
}
