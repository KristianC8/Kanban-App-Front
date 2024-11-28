import { create } from 'zustand'
import { helpHTTP } from '../helpers/helpHTTP'
import { helpTaskPosition } from '../helpers/helpTaskPosition'

export const useTasksStore = create((set, get) => ({
  project: null,
  darggingTask: null,
  loadingProject: false,
  loadingTask: false,
  columns: {
    todo: [],
    inProgress: [],
    done: []
  },

  getProject: async (id) => {
    set({ loadingProject: true })
    try {
      //Api
      const data = await helpHTTP().get(
        `http://localhost:8080/kanban-app/proyectos/${id}`
      )
      if (JSON.stringify(data).includes('Error')) throw data
      set({
        project: data,

        columns: {
          todo: data.tareas.filter((task) => task.estado === 'todo'),
          inProgress: data.tareas.filter(
            (task) => task.estado === 'inProgress'
          ),
          done: data.tareas.filter((task) => task.estado === 'done')
        },

        loadingProject: false
      })
    } catch (error) {
      console.log(error)
    }
  },

  createTask: async (endPoint, form) => {
    try {
      set({ loadingTask: true })

      const { columns } = get()
      //Agragar la ultima posicion a la tarea en la columna
      const newTask = { ...form, posicion: columns.todo.length + 1 }

      //Api
      const response = await helpHTTP().post(endPoint, {
        body: newTask
      })
      if (JSON.stringify(response).includes('Error')) throw response

      set((state) => ({
        columns: {
          ...state.columns,
          todo: [...state.columns.todo, response]
        }
      }))
    } catch (error) {
      console.log(`Create Task Error: ${error}`)
    } finally {
      set({ loadingTask: false })
    }
  },

  deleteTask: async (endPoint, id) => {
    try {
      // API
      const response = await helpHTTP().del(endPoint)
      if (JSON.stringify(response).includes('Error')) throw response

      set((state) => {
        const { columns } = state

        const { taskColumn, task } = helpTaskPosition(columns, id)

        // Eliminar la tarea de la columna y ajustar posiciones
        const updatedColumn = columns[taskColumn]
          .filter((item) => item.id !== id)
          .map((item) => ({
            ...item,
            posicion:
              item.posicion > task.posicion ? item.posicion - 1 : item.posicion
          }))
        console.log(updatedColumn)
        return {
          columns: {
            ...columns,
            [taskColumn]: updatedColumn
          }
        }
      })
    } catch (error) {
      console.error(`Delete Task Error: ${error}`)
    }
  },
  updateTask: async (endPoint, form, id) => {
    try {
      const { columns } = get()
      const { taskColumn, taskIndex } = helpTaskPosition(columns, id)

      const position =
        form.estado === taskColumn
          ? columns[taskColumn][taskIndex].posicion // Mantener la posición original
          : columns[form.estado].length + 1 //Asignar la posicion final en la columna

      // Actualizar la posición de la tarea en la nueva columna
      const updatedTask = { ...form, posicion: position }

      //Api
      const response = await helpHTTP().put(endPoint, { body: updatedTask })
      if (JSON.stringify(response).includes('Error')) throw response

      set((state) => {
        const { columns } = state

        //Si no cambia el estado se actualiza la tarea
        if (form.estado === taskColumn) {
          return {
            columns: {
              ...columns,
              [taskColumn]: columns[taskColumn].map((item, index) =>
                index === taskIndex ? response : item
              )
            }
          }
        }
        //Si cambia el estado se elimina y se agrega a la columna correspondiente
        const prevColumn = columns[taskColumn].filter((item) => item.id !== id)

        for (let task of prevColumn) {
          if (
            task.posicion >
            columns[taskColumn].find((item) => item.id === id).posicion
          ) {
            task.posicion -= 1
          }
        }
        console.log(prevColumn)
        return {
          columns: {
            ...columns,
            [taskColumn]: prevColumn, // Eliminar de la columna actual
            [form.estado]: [...columns[form.estado], response] // Agregar a la nueva columna
          }
        }
      })
    } catch (error) {
      console.error('Update Task Error:', error)
    }
  },

  updateStateTask: async (endPoint, form, id) => {
    try {
      const { columns } = get()
      const { taskColumn, taskIndex } = helpTaskPosition(columns, id)

      const position = columns[form.estado].length + 1 //Asignar la posicion final en la columna
      const updatedTask = { ...form, posicion: position }

      //Api
      const response = await helpHTTP().patch(endPoint, { body: updatedTask })
      if (JSON.stringify(response).includes('Error')) throw response

      set((state) => {
        const { columns } = state

        const prevColumn = columns[taskColumn].filter((item) => item.id !== id)

        for (let task of prevColumn) {
          if (
            task.posicion >
            columns[taskColumn].find((item) => item.id === id).posicion
          ) {
            task.posicion -= 1
          }
        }
        console.log(prevColumn)

        // Si la tarea cambia de columna
        if (form.estado !== taskColumn) {
          return {
            columns: {
              ...columns,
              [taskColumn]: prevColumn, // Eliminar de la columna actual
              [form.estado]: [...columns[form.estado], response] // Agregar a la nueva columna con la respuesta actualizada
            }
          }
        }

        // Si la tarea permanece en la misma columna
        return {
          columns: {
            ...columns,
            [taskColumn]: columns[taskColumn].map((item, index) =>
              index === taskIndex ? response : item
            )
          }
        }
      })
    } catch (error) {
      console.error('Update State Task Error:', error)
    }
  },

  dragStart: (id) => {
    const { columns } = get()
    const { task } = helpTaskPosition(columns, id)
    set({ darggingTask: task })
  },

  dragEnd: () => {
    set({ darggingTask: null })
  },

  onDropColumn: async (e) => {
    e.preventDefault()
    const { darggingTask, columns } = get()

    const dropTargetClass = e.target.classList
    const columnMappings = {
      'kanban-todo': 'todo',
      'kanban-inprogress': 'inProgress',
      'kanban-done': 'done'
    }

    const newState = Object.entries(columnMappings).find(([className]) =>
      dropTargetClass.contains(className)
    )?.[1]

    const previousColumns = structuredClone(columns)

    // const newEstado = Object.keys(columnMappings).find((className) =>
    //   dropTargetClass.contains(className)
    // )

    if (darggingTask) {
      if (newState && darggingTask.estado !== newState) {
        const updatedTask = { ...darggingTask, estado: newState }
        const form = {
          estado: newState,
          posicion: columns[newState].length + 1
        }
        try {
          //Api
          const response = await helpHTTP().patch(
            `http://localhost:8080/kanban-app/estado/tareas/${darggingTask.id}`,
            { body: form }
          )
          if (JSON.stringify(response).includes('Error')) throw response

          set((state) => {
            // Filtrar la columna anterior para eliminar la tarea
            const prevColumn = state.columns[darggingTask.estado].filter(
              (item) => item.id !== darggingTask.id
            )

            for (let task of prevColumn) {
              if (task.posicion > darggingTask.posicion) {
                task.posicion -= 1
              }
            }

            console.log(prevColumn)

            // Crear una nueva columna destino con la tarea actualizada al final
            const targetColumn = [
              ...state.columns[newState],
              { ...updatedTask, posicion: state.columns[newState].length + 1 }
            ]

            // Retornar el nuevo estado con ambas columnas actualizadas
            return {
              columns: {
                ...state.columns,
                [darggingTask.estado]: prevColumn,
                [newState]: targetColumn.sort((a, b) => a.posicion - b.posicion) // Orden explícito
              }
            }
          })
        } catch (error) {
          console.error(`Drop Update Task Error: ${error}`)
          set({ columns: previousColumns })
        }
      }
    }
  },

  onDropCard: async (e) => {
    e.preventDefault()

    const { columns, darggingTask } = get()
    const taskDropId = Number(e.target.parentNode.id)
    let newPosition = null

    //Identificamos la tarea sobre la que se está haciendo el drop dentro de las columnas
    const { taskColumn, taskIndex, task } = helpTaskPosition(
      columns,
      taskDropId
    )

    if (e.target.classList.contains('cardUp')) {
      console.log('up')
      // console.log('tarea:', task)
      if (taskIndex === 0) {
        newPosition = columns[taskColumn][0].posicion - 0.01
        // console.log('primero', newPosition)
      } else {
        newPosition =
          (columns[taskColumn][taskIndex - 1].posicion + task.posicion) / 2
        // console.log('la nueva posicion es:', newPosition)
      }
    } else if (e.target.classList.contains('cardDown')) {
      console.log('down')
      // console.log('tarea:', task)
      if (taskIndex === columns[taskColumn].length - 1) {
        newPosition =
          columns[taskColumn][columns[taskColumn].length - 1].posicion + 1
        // console.log('ultimo', newPosition)
      } else {
        newPosition =
          (task.posicion + columns[taskColumn][taskIndex + 1].posicion) / 2
        // console.log('la nueva posicion es:', newPosition)
      }
    }
    console.log(newPosition)

    if (darggingTask && newPosition) {
      try {
        const form = {
          idTarea: darggingTask.id,
          nuevoEstado: taskColumn,
          nuevaPosicion: newPosition
        }
        const response = await helpHTTP().post(
          'http://localhost:8080/kanban-app/mover',
          { body: form }
        )
        if (JSON.stringify(response).includes('Error')) throw response
        set((state) => {
          const updatedTask = { ...darggingTask, estado: taskColumn }
          // Filtrar la columna anterior para eliminar la tarea
          const prevColumn = state.columns[darggingTask.estado].filter(
            (item) => item.id !== darggingTask.id
          )

          for (let task of prevColumn) {
            if (task.posicion > darggingTask.posicion) {
              task.posicion -= 1
            }
          }

          console.log(prevColumn)

          // Crear una nueva columna destino con la tarea actualizada al final
          const targetColumn = [
            ...state.columns[taskColumn],
            { ...updatedTask, posicion: newPosition }
          ]

          // Retornar el nuevo estado con ambas columnas actualizadas
          if (darggingTask.estado !== taskColumn) {
            return {
              columns: {
                ...state.columns,
                [darggingTask.estado]: prevColumn,
                [taskColumn]: targetColumn.sort(
                  (a, b) => a.posicion - b.posicion
                ) // Orden explícito
              }
            }
          } else {
            return {
              columns: {
                ...state.columns,
                [taskColumn]: [
                  ...prevColumn,
                  { ...updatedTask, posicion: newPosition }
                ].sort((a, b) => a.posicion - b.posicion)
              }
            }
          }
        })
      } catch (error) {
        console.error(`Move Task Error: ${error}`)
      }
    }
  },

  onDragOver: (e) => {
    e.preventDefault()
  },

  onDragLeave: (e) => {
    e.preventDefault()
  }
}))
