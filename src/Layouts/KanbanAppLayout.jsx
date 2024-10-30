import { Header } from '../components/Header'
import { ProjectsProvider } from '../context/projectsContex'
import { Outlet } from 'react-router-dom'

export const KanbanAppLayout = () => {
  return (
    <>
      <Header />
      <ProjectsProvider>
        <main className='min-h-screen-mh py-4'>
          <Outlet />
        </main>
      </ProjectsProvider>
    </>
  )
}
