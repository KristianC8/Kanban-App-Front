import { CreateTask } from './CreateTask'
import { TaskCard } from './TaskCard'
import { useTasksStore } from '../store/tasks'

export const KanbanBoard = () => {
  // const { project, scrollPosRef } = useTasksContext()
  const columns = useTasksStore((state) => state.columns)
  const loadingTask = useTasksStore((state) => state.loadingTask)
  const onDropColumn = useTasksStore((state) => state.onDropColumn)
  const onDragOver = useTasksStore((state) => state.onDragOver)
  const onDragLeave = useTasksStore((state) => state.onDragLeave)

  // useEffect(() => {
  //   // Restablecer la posición del scroll después de actualizar el estado
  //   window.scrollTo(0, scrollPosRef.current)
  // }, [project])

  return (
    <div className='Kanban-container w-full grid grid-cols-3 sm:gap-4 animate-fade min-h-screen'>
      <div className='min-h-screen-mh-kanban py-4 px-1 border border-[#515151] rounded-md'>
        <div className=' w-full mb-4'>
          <h3 className='text-sm sm:text-xl font-bold text-center mb-4'>
            Por Hacer
          </h3>
        </div>
        <div
          className='columnBoard kanban-todo transition-all duration-300 min-h-screen-mh-kanban'
          onDrop={onDropColumn}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          {loadingTask && <span>Agregando Tarea...</span>}
          {columns.todo.length > 0 &&
            columns.todo
              .sort((a, b) => a.posicion - b.posicion)
              .map((tarea) => (
                <TaskCard
                  key={tarea.id}
                  id={tarea.id}
                  title={tarea.titulo}
                  description={tarea.descripcion}
                  state={tarea.estado}
                  priority={tarea.prioridad}
                  date={tarea.fechaPendiente}
                  position={tarea.posicion}
                />
              ))}
          <CreateTask />
        </div>
      </div>
      <div
        className='columnBoard kanban-inprogress min-h-screen-mh-kanban border border-[#515151] rounded-md py-4 px-1 transition-all duration-300'
        onDrop={onDropColumn}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <h3 className='text-sm sm:text-xl font-bold text-center mb-4'>
          En Curso
        </h3>
        {columns.inProgress.length > 0 &&
          columns.inProgress
            .sort((a, b) => a.posicion - b.posicion)
            .map((tarea) => (
              <TaskCard
                key={tarea.id}
                id={tarea.id}
                title={tarea.titulo}
                description={tarea.descripcion}
                state={tarea.estado}
                priority={tarea.prioridad}
                date={tarea.fechaPendiente}
                position={tarea.posicion}
              />
            ))}
      </div>
      <div
        className='columnBoard kanban-done min-h-screen-mh-kanban border border-[#515151] rounded-md py-4 px-1 transition-all duration-300'
        onDrop={onDropColumn}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <h3 className='text-sm sm:text-xl font-bold text-center mb-4'>
          Terminado
        </h3>
        {columns.done.length > 0 &&
          columns.done
            .sort((a, b) => a.posicion - b.posicion)
            .map((tarea) => (
              <TaskCard
                key={tarea.id}
                id={tarea.id}
                title={tarea.titulo}
                description={tarea.descripcion}
                state={tarea.estado}
                priority={tarea.prioridad}
                date={tarea.fechaPendiente}
                position={tarea.posicion}
              />
            ))}
      </div>
    </div>
  )
}
