import { Header } from '../components/Header'
import { ProjectsProvider } from '../context/projectsContex'
import { Outlet } from 'react-router-dom'
import { TasksProvider } from '../context/tasksContext'

export const KanbanAppLayout = () => {
  return (
    <>
      <Header />
      <ProjectsProvider>
        <main className='min-h-screen-mh py-4 mt-12'>
          <TasksProvider>
            <Outlet />
          </TasksProvider>
        </main>
      </ProjectsProvider>
    </>
  )
}
