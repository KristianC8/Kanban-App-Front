import './App.css'
import { CreateProject } from './components/CreateProject'
import { Header } from './components/Header'
import { ProjectsContainer } from './components/ProjectsContainer'

function App() {
  return (
    <>
      <Header />
      <main className='min-h-screen-mh py-4'>
        <CreateProject />
        <h2 className='text-xl font-bold text-[#f74c3c] mb-4'>MIS PORYECTOS</h2>
        <ProjectsContainer />
      </main>
    </>
  )
}

export default App
