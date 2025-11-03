/* eslint-disable react/prop-types */
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
        flex flex-col gap-4 rounded-md bg-[var(--popup-color)]'
      >
        <h3 className='self-center text-xl text-[var(--principal-color)] font-bold'>
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
            className='px-4 py-2 bg-primary rounded bg-[var(--principal-color)] disabled:bg-[#420b0b] text-[#fafafa]'
            onClick={handleDelete}
          >
            Aceptar
          </button>
        </div>
      </dialog>
    </article>
  )
}
