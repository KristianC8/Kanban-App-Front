import { helpHTTP } from './helpHTTP'

export const getProject = async ({ params }) => {
  try {
    const project = await helpHTTP().get(
      `http://localhost:8080/kanban-app/proyectos/${params.id}`
    )
    if (JSON.stringify(project).includes('Error')) throw project
    return project
  } catch (error) {
    console.log(error)
    return null
  }
}
