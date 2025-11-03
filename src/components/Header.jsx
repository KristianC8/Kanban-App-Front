import { Link } from 'react-router-dom'
import { KanbanIcon } from './icons/KanbanIcon'
import { IsReady } from './IsReady'

export const Header = () => {
  return (
    <header
      className='h-fit py-2 fixed top-0 left-0 right-0 backdrop-blur-lg z-20
     border-b border-zinc-700 px-2 sm:px-[10%] flex justify-between'
    >
      <Link to={'/'} className='flex gap-2 items-center w-fit'>
        <KanbanIcon />
        <h1 className=' text-2xl font-bold'>KANBAN APP</h1>
      </Link>
      <IsReady />
    </header>
  )
}
