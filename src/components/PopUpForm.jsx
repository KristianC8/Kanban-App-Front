/* eslint-disable react/prop-types */
import { usePopUp } from '../hooks/usePopUp'

export const PopUpForm = ({
  children,
  stylesBtn,
  title,
  titelBtn,
  OpenBtn,
  textBtn,
  handleSubmit,
  functionClose,
  initalValidation,
  errors
}) => {
  const { isVisible, handleBtnOpen, handleBtnCancel, handleClosePopup } =
    usePopUp(functionClose)

  return (
    <>
      <button
        className={`${stylesBtn}`}
        onClick={handleBtnOpen}
        title={titelBtn}
      >
        {OpenBtn}
      </button>
      <article
        className={`${isVisible ? 'flex' : 'hidden'} fixed top-0 left-0 w-full h-screen md:h-screen
         bg-[#242424] backdrop-blur-sm bg-opacity-50 justify-center items-center z-30`}
      >
        <dialog
          className='w-4/5 md:w-96 animate-fade p-10 shadow-lg
        flex flex-col gap-4 rounded-md bg-[#212121] z-30'
        >
          <h3 className='self-center text-[var(--principal-color)] text-xl font-bold'>
            {title}
          </h3>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            {children}
            <div className='flex gap-4 justify-center'>
              <button
                type='button'
                className='px-4 py-2 bg-primary rounded '
                onClick={handleBtnCancel}
              >
                Cancelar
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-primary rounded bg-[var(--principal-color)] disabled:bg-[#420b0b]'
                onClick={handleClosePopup}
                disabled={
                  initalValidation === false || Object.keys(errors).length !== 0
                }
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
