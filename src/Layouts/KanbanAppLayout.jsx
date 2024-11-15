import { Header } from '../components/Header'
import { ProjectsProvider } from '../context/projectsContex'
import { Outlet } from 'react-router-dom'
import { TasksProvider } from '../context/tasksContext'
import { DragProvider } from '../context/dragContext'

export const KanbanAppLayout = () => {
  return (
    <>
      <Header />
      <ProjectsProvider>
        <TasksProvider>
          <DragProvider>
            <main className='min-h-screen-mh py-4 mt-12'>
              <Outlet />
            </main>
          </DragProvider>
        </TasksProvider>
      </ProjectsProvider>
    </>
  )
}
