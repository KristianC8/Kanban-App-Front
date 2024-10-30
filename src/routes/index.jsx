import { createBrowserRouter } from 'react-router-dom'
import { KanbanAppLayout } from '../Layouts/KanbanAppLayout'
import { ErrorPage } from '../pages/ErrorPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { getProject } from '../helpers/getProject'
import { ProjectKanbanPage } from '../pages/ProjectKanbanPage'

export const router = createBrowserRouter([
  {
    element: <KanbanAppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <ProjectsPage />
      },
      {
        path: '/projects/:id',
        element: <ProjectKanbanPage />,
        loader: getProject
      }
    ]
  }
])
