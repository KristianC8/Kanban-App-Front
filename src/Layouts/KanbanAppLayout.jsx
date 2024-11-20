import { Header } from '../components/Header'
import { Outlet } from 'react-router-dom'

export const KanbanAppLayout = () => {
  return (
    <>
      <Header />
      <main className='min-h-screen-mh py-4 mt-12'>
        <Outlet />
      </main>
    </>
  )
}
