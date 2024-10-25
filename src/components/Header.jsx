import { KanbanIcon } from './icons/KanbanIcon'

export const Header = () => {
  return (
    <header className=' flex gap-2 h-fit py-2 items-center'>
      <KanbanIcon />
      <h1 className=' text-2xl font-bold'>KANBAN APP</h1>
    </header>
  )
}
