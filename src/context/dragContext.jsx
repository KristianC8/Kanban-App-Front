import { createContext, useState } from 'react'
import { useTasksContext } from '../hooks/useTasksContext'

export const DragContext = createContext()

// eslint-disable-next-line react/prop-types
export const DragProvider = ({ children }) => {
  const [draggedElement, setDraggedElement] = useState(null)
  const [hoveredColumn, setHoveredColumn] = useState(null)
  // const draggedElementRef = useRef(null)
  // const dragPreviewRef = useRef(null)
  // const sourceContainer = useRef(null)

  const { updateTask } = useTasksContext()

  // const handleDragStart = (e) => {
  //   draggedElementRef.current = e.target
  //   sourceContainer.current = draggedElementRef.current.parentNode
  //   // e.dataTransfer.setData('application/x-moz-node', draggedElementRef.current)
  //   e.effectAllowed = 'move'
  //   // const taskIndex = project.tareas.findIndex(
  //   //   (item) => item.id === draggedElementRef.current.id
  //   // )
  //   // setCurrentTask(project.tareas[taskIndex])
  // }

  // const handleDrop = (e) => {
  //   e.preventDefault()

  //   if (e.target.classList.contains('columnBoard')) {
  //     if (draggedElementRef.current) {
  //       e.target.appendChild(draggedElementRef.current)
  //       let form = null
  //       const endPoint = `http://localhost:8080/kanban-app/estado/tareas/${draggedElementRef.current.id}`
  //       if (e.target.classList.contains('kanban-todo')) {
  //         if (draggedElementRef.current) {
  //           form = {
  //             estado: 'todo'
  //           }
  //           updateTask(endPoint, form, draggedElementRef.current.id)
  //         }
  //       } else if (e.target.classList.contains('kanban-inprogress')) {
  //         form = {
  //           estado: 'inProgress'
  //         }
  //         updateTask(endPoint, form, draggedElementRef.current.id)
  //       } else if (e.target.classList.contains('kanban-done')) {
  //         form = {
  //           estado: 'done'
  //         }
  //         updateTask(endPoint, form, draggedElementRef.current.id)
  //       }
  //     }
  //   } else if (e.target.classList.contains('cardDown')) {
  //     if (draggedElementRef.current) {
  //       e.target.parentNode.insertAdjacentElement(
  //         'afterend',
  //         draggedElementRef.current
  //       )
  //     }
  //   } else if (e.target.classList.contains('cardUp')) {
  //     if (draggedElementRef.current) {
  //       e.target.parentNode.insertAdjacentElement(
  //         'beforebegin',
  //         draggedElementRef.current
  //       )
  //     }
  //   }
  // }

  const handleDrop = (e) => {
    e.preventDefault()

    if (e.target.classList.contains('columnBoard')) {
      if (draggedElement) {
        let newEstado = null

        if (e.target.classList.contains('kanban-todo')) {
          newEstado = 'todo'
        } else if (e.target.classList.contains('kanban-inprogress')) {
          newEstado = 'inProgress'
        } else if (e.target.classList.contains('kanban-done')) {
          newEstado = 'done'
        }

        if (newEstado) {
          // Actualización optimista del estado
          const taskId = draggedElement.id
          const form = { estado: newEstado }
          const endPoint = `http://localhost:8080/kanban-app/estado/tareas/${taskId}`

          updateTask(endPoint, form, taskId)

          // No manipules el DOM directamente
          // Confía en que React re-renderice la UI cuando el estado cambie
        }
      }
    } else if (e.target.classList.contains('cardDown')) {
      // Lógica para mover la tarjeta
    } else if (e.target.classList.contains('cardUp')) {
      // Lógica para mover la tarjeta
    }
  }

  // const handleDragOver = (e) => {
  //   e.preventDefault()
  //   e.stopPropagation()

  //   const { currentTarget } = e

  //   if (sourceContainer.current === currentTarget) return

  //   if (
  //     draggedElementRef.current &&
  //     !dragPreviewRef.current &&
  //     currentTarget !== sourceContainer.current &&
  //     !draggedElementRef.current.contains(currentTarget)
  //   ) {
  //     // Clona el nodo y lo guarda en dragPreviewRef
  //     dragPreviewRef.current = draggedElementRef.current.cloneNode(true)
  //     dragPreviewRef.current.style.opacity = '0.6'
  //     dragPreviewRef.current.style.pointerEvents = 'none'
  //     dragPreviewRef.current.style.transition = 'transform 0.5s ease-in-out'

  //     if (currentTarget.classList.contains('columnBoard')) {
  //       if (draggedElementRef.current) {
  //         currentTarget.appendChild(dragPreviewRef.current)
  //       }
  //     } else if (currentTarget.classList.contains('cardDown')) {
  //       if (draggedElementRef.current) {
  //         currentTarget.parentNode.insertAdjacentElement(
  //           'afterend',
  //           dragPreviewRef.current
  //         )
  //       }
  //     }
  //   }
  // }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const targetColumn = e.currentTarget

    // Verifica si la columna objetivo es diferente a la actual
    if (hoveredColumn !== targetColumn.dataset.columnId) {
      setHoveredColumn(targetColumn.dataset.columnId) // Asume que `data-column-id` está presente en las columnas
    }
  }

  // const handleDragLeave = (e) => {
  //   e.preventDefault()

  //   if (dragPreviewRef.current) dragPreviewRef.current.remove()
  //   dragPreviewRef.current = null
  // }

  // const handleDragEnd = () => {
  //   draggedElementRef.current = null
  //   sourceContainer.current = null
  //   if (dragPreviewRef.current) dragPreviewRef.current.remove()
  //   dragPreviewRef.current = null
  // }

  const handleDragStart = (e) => {
    setDraggedElement(e.target)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setHoveredColumn(null)
  }

  const handleDragEnd = () => {
    setDraggedElement(null)
    setHoveredColumn(null)
  }

  // const elementRef = useRef(null)
  // const handleMouseMove = (e) => {
  //   elementRef.current = e.target
  //   if (elementRef.current) {
  //     const rect = elementRef.current.getBoundingClientRect()
  //     const mouseY = e.clientY - rect.top // posición Y del mouse dentro del elemento
  //     const elementHeight = rect.height

  //     // Definir las zonas de proximidad (20% superior e inferior del elemento)
  //     const proximityZone = elementHeight * 0.2 // 20% del alto del elemento

  //     if (mouseY < proximityZone) {
  //       console.log('El mouse está en la zona superior cercana al borde')
  //     } else if (mouseY > elementHeight - proximityZone) {
  //       console.log('El mouse está en la zona inferior cercana al borde')
  //     } else {
  //       console.log('El mouse está en la zona central')
  //     }
  //   }
  // }

  return (
    <DragContext.Provider
      value={{
        draggedElement,
        handleDragStart,
        handleDragEnd,
        handleDrop,
        handleDragOver,
        handleDragLeave
      }}
    >
      {children}
    </DragContext.Provider>
  )
}
