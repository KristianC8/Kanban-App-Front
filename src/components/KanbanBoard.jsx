import { CreateTask } from './CreateTask'
import { useTasksContext } from '../hooks/useTasksContext'

export const KanbanBoard = () => {
  const { project } = useTasksContext()
  return (
    <div className='Kanban-container w-full grid grid-cols-3 sm:gap-4'>
      <div className='kanban-todo min-h-screen-mh-kanban bg-red-600 rounded-md '>
        <CreateTask />
        {/* {project.tareas.length === 0 && (
          <span className='block px-2'>No hay Tareas</span>
        )} */}
        {project.tareas.length > 0 ? (
          project.tareas
            .filter((tarea) => tarea.estado === 'todo')
            .map((tarea) => <p key={tarea.id}>{tarea.titulo}</p>)
        ) : (
          <p>No hay</p>
        )}
      </div>
      <div className='kanban-inprogress min-h-screen-mh-kanban bg-amber-400 rounded-md '></div>
      <div className='kanban-done min-h-screen-mh-kanban bg-green-500 rounded-md '></div>
    </div>
  )
}
