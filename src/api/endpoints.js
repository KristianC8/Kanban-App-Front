const BASE_URL = import.meta.env.VITE_API_URL

const endPoints = {
  projects: {
    create: `${BASE_URL}/kanban-app/proyectos`,
    update: (id) => `${BASE_URL}/kanban-app/proyectos/${id}`,
    listAll: `${BASE_URL}/kanban-app/proyectos`,
    byId: (id) => `${BASE_URL}/kanban-app/tareas/${id}`,
    delete: (id) => `${BASE_URL}/kanban-app/proyectos/${id}`
  },
  tasks: {
    getProject: (id) => `${BASE_URL}/kanban-app/proyectos/${id}`,
    create: `${BASE_URL}/kanban-app/tareas`,
    updateState: (id) => `${BASE_URL}/kanban-app/estado/tareas/${id}`,
    delete: (id) => `${BASE_URL}/kanban-app/tareas/${id}`,
    update: (id) => `${BASE_URL}/kanban-app/tareas/${id}`,
    move: `${BASE_URL}/kanban-app/mover`
  },
  health: `${BASE_URL}/health`
}

export default endPoints
