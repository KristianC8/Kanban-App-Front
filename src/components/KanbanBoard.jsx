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
    <div className='Kanban-container w-full grid grid-cols-3 sm:gap-2 animate-fade min-h-screen'>
      <div className='pb-4 rounded-[7px]'>
        <div className=' w-full py-3 rounded-t-[5px] bg-[var(--board-title-color)]'>
          <h3 className='text-sm sm:text-xl font-bold text-center text-[var(--todo-color)]'>
            Por Hacer
          </h3>
        </div>
        <div
          className='columnBoard kanban-todo transition-all duration-300 h-[calc(100%-36px)] px-1 py-1 bg-[var(--board-body-color)] rounded-b-md '
          onDrop={onDropColumn}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
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
          {loadingTask && <p>Agregando Tarea...</p>}
          <CreateTask />
        </div>
      </div>
      <div className='pb-4 rounded-[7px]'>
        <div className=' w-full py-3 rounded-t-[5px] bg-[var(--board-title-color)]'>
          <h3 className='text-sm sm:text-xl font-bold text-center text-[var(--inProgress-color)]'>
            En Curso
          </h3>
        </div>
        <div
          className='columnBoard kanban-inprogress transition-all duration-300 h-[calc(100%-36px)] px-1 py-1 bg-[var(--board-body-color)] rounded-b-md'
          onDrop={onDropColumn}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
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
      </div>
      <div className='pb-4 rounded-[7px]'>
        <div className=' w-full py-3 rounded-t-[5px] bg-[var(--board-title-color)]'>
          <h3 className='text-sm sm:text-xl font-bold text-center text-[var(--done-color)]'>
            Terminado
          </h3>
        </div>
        <div
          className='columnBoard kanban-done transition-all duration-300 h-[calc(100%-36px)] px-1 py-1 bg-[var(--board-body-color)] rounded-b-md'
          onDrop={onDropColumn}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
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
    </div>
  )
}
