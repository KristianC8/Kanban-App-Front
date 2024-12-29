import { Link } from 'react-router-dom'
import { KanbanIcon } from './icons/KanbanIcon'

export const Header = () => {
  return (
    <header
      className='h-fit py-2 fixed top-0 left-0 right-0 bg-[#1a1a1a] backdrop-blur-lg z-20
     border-b border-zinc-700 px-[10%]'
    >
      <Link to={'/'} className='flex gap-2 items-center'>
        <KanbanIcon />
        <h1 className=' text-2xl font-bold'>KANBAN APP</h1>
      </Link>
    </header>
  )
}
