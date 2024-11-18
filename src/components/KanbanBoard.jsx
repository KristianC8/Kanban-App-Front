import { CreateTask } from './CreateTask'
// import { useTasksContext } from '../hooks/useTasksContext'
import { TaskCard } from './TaskCard'
// import { useEffect } from 'react'
// import { useDragContext } from '../hooks/useDragContext'
import { useTasksStore } from '../store/tasks'
import { useEffect } from 'react'

export const KanbanBoard = () => {
  // const { project, scrollPosRef } = useTasksContext()
  const columns = useTasksStore((state) => state.columns)

  // useEffect(() => {
  //   // Restablecer la posición del scroll después de actualizar el estado
  //   window.scrollTo(0, scrollPosRef.current)
  // }, [project])

  // useEffect(() => {
  //   getTasks(project.id)
  // }, [])

  // const { handleDrop, handleDragOver, handleDragLeave } = useDragContext()

  useEffect(() => {
    console.log('se monta el kanban')
  }, [])

  return (
    <div className='Kanban-container w-full grid grid-cols-3 sm:gap-4 animate-fade min-h-screen'>
      <div className='min-h-screen-mh-kanban p-4 border border-[#515151] rounded-md'>
        <div className=' w-full mb-4'>
          <h3 className='text-sm sm:text-xl font-bold text-center mb-4'>
            Por Hacer
          </h3>
          <CreateTask />
        </div>
        <div
          className='columnBoard kanban-todo transition-all duration-300 min-h-screen-mh-kanban'
          onDrop={() => {}}
        >
          {/* {project.tareas.length === 0 && (
          <span className='block px-2'>No hay Tareas</span>
        )} */}
          {columns.todo.length > 0 &&
            columns.todo.map((tarea) => (
              <TaskCard
                key={tarea.id}
                id={tarea.id}
                title={tarea.titulo}
                description={tarea.descripcion}
                state={tarea.estado}
                priority={tarea.prioridad}
                date={tarea.fechaPendiente}
              />
            ))}
        </div>
      </div>
      <div
        className='columnBoard kanban-inprogress min-h-screen-mh-kanban border border-[#515151] rounded-md p-4 transition-all duration-300'
        onDrop={() => {}}
      >
        <h3 className='text-sm sm:text-xl font-bold text-center mb-4'>
          En Curso
        </h3>
        {columns.inProgress.length > 0 &&
          columns.inProgress.map((tarea) => (
            <TaskCard
              key={tarea.id}
              id={tarea.id}
              title={tarea.titulo}
              description={tarea.descripcion}
              state={tarea.estado}
              priority={tarea.prioridad}
              date={tarea.fechaPendiente}
            />
          ))}
      </div>
      <div
        className='columnBoard kanban-done min-h-screen-mh-kanban border border-[#515151] rounded-md p-4 transition-all duration-300'
        onDrop={() => {}}
      >
        <h3 className='text-sm sm:text-xl font-bold text-center mb-4'>
          Terminado
        </h3>
        {columns.done.length > 0 &&
          columns.done.map((tarea) => (
            <TaskCard
              key={tarea.id}
              id={tarea.id}
              title={tarea.titulo}
              description={tarea.descripcion}
              state={tarea.estado}
              priority={tarea.prioridad}
              date={tarea.fechaPendiente}
            />
          ))}
      </div>
    </div>
  )
}
