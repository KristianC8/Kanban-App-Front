const BASE_URL = 'https://kanban-api-djkd.onrender.com'

const endPoints = {
  projects: {
    create: `${BASE_URL}/kanban-app/proyectos`,
    update: (id) => `${BASE_URL}/kanban-app/proyectos/${id}`,
    listAll: `${BASE_URL}/kanban-app/proyectos`,
    byId: (id) => `${BASE_URL}/kanban-app/tareas/${id}`,
    delete: (id) => `${BASE_URL}/kanban-app/proyectos/${id}`
  },
  tasks: `${BASE_URL}/alfd`
}

export default endPoints
