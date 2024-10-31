import React from 'react'

export const KanbanBoard = () => {
  return (
    <div className='Kanban-container w-full grid grid-cols-3 sm:gap-4'>
      <div className='kanban-todo min-h-screen-mh-kanban bg-red-600 rounded-md '></div>
      <div className='kanban-inprogress min-h-screen-mh-kanban bg-amber-400 rounded-md '></div>
      <div className='kanban-done min-h-screen-mh-kanban bg-green-500 rounded-md '></div>
    </div>
  )
}
