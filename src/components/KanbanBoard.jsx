import { CreateTask } from './CreateTask'
import { useTasksContext } from '../hooks/useTasksContext'
import { TaskCard } from './TaskCard'

export const KanbanBoard = () => {
  const { project } = useTasksContext()
  return (
    <div className='Kanban-container w-full grid grid-cols-3 sm:gap-4'>
      <div className='kanban-todo min-h-screen-mh-kanban border border-[#515151] rounded-md p-4'>
        <h3 className='text-sm sm:text-xl font-bold text-center'>Por Hacer</h3>
        <div className='w-full'>
          <CreateTask />
        </div>
        {/* {project.tareas.length === 0 && (
          <span className='block px-2'>No hay Tareas</span>
        )} */}
        {project.tareas.length > 0 &&
          project.tareas
            .filter((tarea) => tarea.estado === 'todo')
            .map((tarea) => (
              <TaskCard
                key={tarea.id}
                id={tarea.id}
                title={tarea.titulo}
                description={tarea.descripcion}
                priority={tarea.prioridad}
                date={tarea.fechaPendiente}
              />
            ))}
      </div>
      <div className='kanban-inprogress min-h-screen-mh-kanban border border-[#515151] rounded-md p-4'>
        <h3 className='text-sm sm:text-xl font-bold text-center'>En Curso</h3>
      </div>
      <div className='kanban-done min-h-screen-mh-kanban border border-[#515151] rounded-md p-4'>
        <h3 className='text-sm sm:text-xl font-bold text-center'>Terminado</h3>
      </div>
    </div>
  )
}
