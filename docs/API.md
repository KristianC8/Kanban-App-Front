# Documentación de Integración con API

Este documento describe cómo el frontend de la aplicación Kanban se integra con el backend Java Spring Boot a través de una API REST.

## Tabla de Contenidos

- [Configuración](#configuración)
- [Estructura de la API](#estructura-de-la-api)
- [Endpoints](#endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Manejo de Errores](#manejo-de-errores)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Mejores Prácticas](#mejores-prácticas)

## Configuración

### Variables de Entorno

Configura la URL del backend en el archivo `.env`:

```env
VITE_API_URL=http://localhost:8080
```

Para producción:

```env
VITE_API_URL=https://tu-backend.com
```

### Configuración de Endpoints

El proyecto utiliza un archivo centralizado para definir todos los endpoints:

```javascript
// api/endpoints.js
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
```

### Helper HTTP

El proyecto utiliza un helper personalizado basado en Fetch API:

```javascript
// helpers/helpHTTP.js
export const helpHTTP = () => {
  const customFetch = async (endpoint, options = {}) => {
    const defaultHeaders = {
      'Content-Type': 'application/json'
    }

    const controller = new AbortController()
    options.signal = controller.signal

    options.method = options.method || 'GET'
    options.headers = options.headers
      ? { ...defaultHeaders, ...options.headers }
      : defaultHeaders

    options.body = JSON.stringify(options.body) || false
    if (!options.body) delete options.body

    // Timeout de 10 segundos
    setTimeout(() => controller.abort(), 10000)

    try {
      const res = await fetch(endpoint, options)
      const data = await res.json()

      if (!res.ok) {
        throw {
          status: res.status,
          statusText: res.statusText,
          data
        }
      }

      return data
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const get = (url) => customFetch(url)
  const post = (url, body) => customFetch(url, { method: 'POST', body })
  const put = (url, body) => customFetch(url, { method: 'PUT', body })
  const del = (url) => customFetch(url, { method: 'DELETE' })
  const patch = (url, body) => customFetch(url, { method: 'PATCH', body })

  return { get, post, put, del, patch }
}
```

## Estructura de la API

La API REST del backend sigue las convenciones RESTful:

```
Base URL: http://localhost:8080

/kanban-app
├── /proyectos          # Gestión de proyectos
├── /tareas             # Gestión de tareas
├── /estado/tareas      # Actualización de estado de tareas
└── /mover              # Mover tareas entre estados

/health                 # Health check del backend
```

## Endpoints

### Proyectos (Projects)

#### Obtener todos los proyectos

```http
GET /kanban-app/proyectos
```

**Respuesta exitosa (200)**:

```json
[
  {
    "id": 1,
    "nombre": "Proyecto Frontend",
    "descripcion": "Desarrollo del frontend de la aplicación",
    "fechaCreacion": "2024-01-15T10:30:00"
  }
]
```

**Implementación**:

```javascript
import { helpHTTP } from '../helpers/helpHTTP'
import endPoints from '../api/endpoints'

const api = helpHTTP()

const fetchProjects = async () => {
  try {
    const data = await api.get(endPoints.projects.listAll)
    return data
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}
```

#### Crear un proyecto

```http
POST /kanban-app/proyectos
```

**Body**:

```json
{
  "nombre": "Nuevo Proyecto",
  "descripcion": "Descripción del proyecto"
}
```

**Respuesta exitosa (201)**:

```json
{
  "id": 5,
  "nombre": "Nuevo Proyecto",
  "descripcion": "Descripción del proyecto",
  "fechaCreacion": "2024-01-16T09:00:00"
}
```

**Implementación**:

```javascript
const createProject = async (projectData) => {
  try {
    const data = await api.post(endPoints.projects.create, projectData)
    return data
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}
```

#### Actualizar un proyecto

```http
PUT /kanban-app/proyectos/:id
```

**Body**:

```json
{
  "nombre": "Proyecto Actualizado",
  "descripcion": "Nueva descripción"
}
```

**Implementación**:

```javascript
const updateProject = async (id, updates) => {
  try {
    const data = await api.put(endPoints.projects.update(id), updates)
    return data
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}
```

#### Eliminar un proyecto

```http
DELETE /kanban-app/proyectos/:id
```

**Respuesta exitosa (204)**:
Sin contenido

**Implementación**:

```javascript
const deleteProject = async (id) => {
  try {
    await api.del(endPoints.projects.delete(id))
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}
```

### Tareas (Tasks)

#### Obtener proyecto con sus tareas

```http
GET /kanban-app/proyectos/:id
```

**Respuesta exitosa (200)**:

```json
{
  "id": 1,
  "nombre": "Proyecto Frontend",
  "descripcion": "Desarrollo del frontend",
  "tareas": [
    {
      "id": 1,
      "titulo": "Implementar login",
      "descripcion": "Crear página de login",
      "estado": "EN_PROGRESO",
      "posicion": 0,
      "fechaCreacion": "2024-01-15T10:30:00"
    }
  ]
}
```

**Implementación**:

```javascript
const fetchProjectWithTasks = async (projectId) => {
  try {
    const data = await api.get(endPoints.tasks.getProject(projectId))
    return data
  } catch (error) {
    console.error('Error fetching project with tasks:', error)
    throw error
  }
}
```

#### Crear una tarea

```http
POST /kanban-app/tareas
```

**Body**:

```json
{
  "titulo": "Nueva tarea",
  "descripcion": "Descripción de la tarea",
  "proyectoId": 1,
  "estado": "POR_HACER"
}
```

**Respuesta exitosa (201)**:

```json
{
  "id": 10,
  "titulo": "Nueva tarea",
  "descripcion": "Descripción de la tarea",
  "estado": "POR_HACER",
  "posicion": 0,
  "fechaCreacion": "2024-01-16T09:00:00"
}
```

**Implementación**:

```javascript
const createTask = async (taskData) => {
  try {
    const data = await api.post(endPoints.tasks.create, taskData)
    return data
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}
```

#### Actualizar una tarea

```http
PUT /kanban-app/tareas/:id
```

**Body**:

```json
{
  "titulo": "Tarea actualizada",
  "descripcion": "Nueva descripción"
}
```

**Implementación**:

```javascript
const updateTask = async (id, updates) => {
  try {
    const data = await api.put(endPoints.tasks.update(id), updates)
    return data
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}
```

#### Actualizar estado de una tarea

```http
PATCH /kanban-app/estado/tareas/:id
```

**Body**:

```json
{
  "estado": "COMPLETADO"
}
```

**Implementación**:

```javascript
const updateTaskState = async (id, newState) => {
  try {
    const data = await api.patch(endPoints.tasks.updateState(id), {
      estado: newState
    })
    return data
  } catch (error) {
    console.error('Error updating task state:', error)
    throw error
  }
}
```

#### Mover tarea

```http
POST /kanban-app/mover
```

**Body**:

```json
{
  "tareaId": 5,
  "nuevoEstado": "EN_PROGRESO",
  "nuevaPosicion": 2
}
```

**Implementación**:

```javascript
const moveTask = async (taskId, newState, newPosition) => {
  try {
    const data = await api.post(endPoints.tasks.move, {
      tareaId: taskId,
      nuevoEstado: newState,
      nuevaPosicion: newPosition
    })
    return data
  } catch (error) {
    console.error('Error moving task:', error)
    throw error
  }
}
```

#### Eliminar una tarea

```http
DELETE /kanban-app/tareas/:id
```

**Implementación**:

```javascript
const deleteTask = async (id) => {
  try {
    await api.del(endPoints.tasks.delete(id))
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}
```

### Health Check

#### Verificar disponibilidad del backend

```http
GET /health
```

**Respuesta exitosa (200)**:

```json
{
  "status": "UP"
}
```

**Implementación**:

```javascript
const checkBackendHealth = async () => {
  try {
    const data = await api.get(endPoints.health)
    return data.status === 'UP'
  } catch (error) {
    console.error('Backend no disponible:', error)
    return false
  }
}
```

## Modelos de Datos

### Proyecto

```javascript
/**
 * @typedef {Object} Project
 * @property {number} id - ID único del proyecto
 * @property {string} nombre - Nombre del proyecto
 * @property {string} descripcion - Descripción del proyecto
 * @property {string} fechaCreacion - Fecha de creación (ISO 8601)
 * @property {Task[]} [tareas] - Lista de tareas (opcional)
 */
```

### Tarea

```javascript
/**
 * @typedef {Object} Task
 * @property {number} id - ID único de la tarea
 * @property {string} titulo - Título de la tarea
 * @property {string} descripcion - Descripción de la tarea
 * @property {string} estado - Estado: 'POR_HACER' | 'EN_PROGRESO' | 'COMPLETADO'
 * @property {number} posicion - Posición dentro de su columna
 * @property {number} proyectoId - ID del proyecto al que pertenece
 * @property {string} fechaCreacion - Fecha de creación (ISO 8601)
 */
```

## Manejo de Errores

### Estructura de Errores

El helper HTTP lanza errores con la siguiente estructura:

```javascript
{
  status: 400,        // Código de estado HTTP
  statusText: 'Bad Request',
  data: {             // Datos del error del backend
    message: 'Validation failed',
    errors: [...]
  }
}
```

### Manejo en el Frontend

```javascript
const handleApiError = (error) => {
  if (error.status) {
    // Error del servidor
    switch (error.status) {
      case 400:
        return 'Datos inválidos'
      case 404:
        return 'Recurso no encontrado'
      case 500:
        return 'Error del servidor'
      default:
        return error.data?.message || 'Error desconocido'
    }
  } else if (error.name === 'AbortError') {
    // Timeout
    return 'La petición tardó demasiado'
  } else {
    // Error de red
    return 'No se pudo conectar con el servidor'
  }
}

// Uso
try {
  await createTask(taskData)
} catch (error) {
  const errorMessage = handleApiError(error)
  console.error(errorMessage)
  // Mostrar mensaje al usuario
}
```

## Ejemplos de Uso

### Ejemplo Completo: Crear Tarea

```javascript
import { useState } from 'react'
import { helpHTTP } from '../helpers/helpHTTP'
import endPoints from '../api/endpoints'

const CreateTaskForm = ({ projectId }) => {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const api = helpHTTP()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const taskData = {
      titulo,
      descripcion,
      proyectoId: projectId,
      estado: 'POR_HACER'
    }

    try {
      const newTask = await api.post(endPoints.tasks.create, taskData)
      console.log('Tarea creada:', newTask)
      // Limpiar formulario
      setTitulo('')
      setDescripcion('')
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder='Título'
        required
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder='Descripción'
      />
      {error && <p className='error'>{error}</p>}
      <button type='submit' disabled={loading}>
        {loading ? 'Creando...' : 'Crear Tarea'}
      </button>
    </form>
  )
}
```

### Ejemplo: Context con API

```javascript
import { createContext, useState, useEffect } from 'react'
import { helpHTTP } from '../helpers/helpHTTP'
import endPoints from '../api/endpoints'

export const ProjectsContext = createContext()

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const api = helpHTTP()

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get(endPoints.projects.listAll)
      setProjects(data)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData) => {
    try {
      const newProject = await api.post(endPoints.projects.create, projectData)
      setProjects((prev) => [...prev, newProject])
      return newProject
    } catch (err) {
      setError(handleApiError(err))
      throw err
    }
  }

  const updateProject = async (id, updates) => {
    try {
      const updatedProject = await api.put(
        endPoints.projects.update(id),
        updates
      )
      setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)))
      return updatedProject
    } catch (err) {
      setError(handleApiError(err))
      throw err
    }
  }

  const deleteProject = async (id) => {
    try {
      await api.del(endPoints.projects.delete(id))
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError(handleApiError(err))
      throw err
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const value = {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  }

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  )
}
```

## Mejores Prácticas

### 1. Centralizar Configuración

Mantén todos los endpoints en un solo archivo:

```javascript
// api/endpoints.js
export default endPoints
```

### 2. Reutilizar el Helper HTTP

Crea una instancia del helper en cada módulo que lo necesite:

```javascript
import { helpHTTP } from '../helpers/helpHTTP'
const api = helpHTTP()
```

### 3. Manejo Consistente de Errores

Crea una función centralizada para manejar errores:

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  // Lógica de manejo de errores
}
```

### 4. Loading States

Siempre maneja estados de carga:

```javascript
const [loading, setLoading] = useState(false)

if (loading) return <Loader />
```

### 5. Optimistic Updates

Para mejor UX, actualiza la UI antes de la respuesta del servidor:

```javascript
const deleteTask = async (id) => {
  // Actualización optimista
  setTasks((prev) => prev.filter((t) => t.id !== id))

  try {
    await api.del(endPoints.tasks.delete(id))
  } catch (err) {
    // Revertir en caso de error
    fetchTasks()
    showError('Error al eliminar tarea')
  }
}
```

### 6. Timeout Configurado

El helper ya incluye un timeout de 10 segundos para evitar peticiones colgadas.

### 7. AbortController

El helper utiliza AbortController para cancelar peticiones cuando sea necesario.

### 8. Health Checks

Implementa verificaciones periódicas del backend:

```javascript
useEffect(() => {
  const checkHealth = async () => {
    const isAvailable = await checkBackendHealth()
    setBackendAvailable(isAvailable)
  }

  checkHealth()
  const interval = setInterval(checkHealth, 30000) // Cada 30 segundos

  return () => clearInterval(interval)
}, [])
```

## Recursos Adicionales

- [Fetch API - MDN](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)
- [Documentación de Spring Boot](https://spring.io/projects/spring-boot)
- [REST API Best Practices](https://restfulapi.net/)
- [AbortController - MDN](https://developer.mozilla.org/es/docs/Web/API/AbortController)
