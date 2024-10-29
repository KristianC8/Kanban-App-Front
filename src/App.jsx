import './App.css'
import { CreateProject } from './components/CreateProject'
import { Header } from './components/Header'
import { ProjectsContainer } from './components/ProjectsContainer'
import { ProjectsProvider } from './context/projectsContex'

function App() {
  return (
    <>
      <Header />
      <ProjectsProvider>
        <main className='min-h-screen-mh py-4'>
          <CreateProject />
          <h2 className='text-xl font-bold text-[#f74c3c] mb-4'>PORYECTOS</h2>
          <ProjectsContainer />
        </main>
      </ProjectsProvider>
    </>
  )
}

export default App
