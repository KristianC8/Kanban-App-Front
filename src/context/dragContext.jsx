import { createContext, useRef } from 'react'

export const DragContext = createContext()

// eslint-disable-next-line react/prop-types
export const DragProvider = ({ children }) => {
  const draggedElementRef = useRef(null)
  const dragPreviewRef = useRef(null)
  const sourceContainer = useRef(null)

  const handleDragStart = (e) => {
    draggedElementRef.current = e.target
    sourceContainer.current = draggedElementRef.current.parentNode
    // e.dataTransfer.setData('application/x-moz-node', draggedElementRef.current)
    e.effectAllowed = 'move'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    // const { currentTarget } = e

    // if (sourceContainer.current && draggedElementRef.current) {
    //   sourceContainer.current.removeChild(draggedElementRef.current)
    // }

    if (e.target.classList.contains('columnBoard')) {
      if (draggedElementRef.current) {
        e.target.appendChild(draggedElementRef.current)
      }
    } else if (e.target.classList.contains('cardDown')) {
      if (draggedElementRef.current) {
        e.target.parentNode.insertAdjacentElement(
          'afterend',
          draggedElementRef.current
        )
      }
    } else if (e.target.classList.contains('cardUp')) {
      if (draggedElementRef.current) {
        e.target.parentNode.insertAdjacentElement(
          'beforebegin',
          draggedElementRef.current
        )
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const { currentTarget } = e

    if (sourceContainer.current === currentTarget) return

    if (
      draggedElementRef.current &&
      !dragPreviewRef.current &&
      currentTarget !== sourceContainer.current &&
      !draggedElementRef.current.contains(currentTarget)
    ) {
      // Clona el nodo y lo guarda en dragPreviewRef
      dragPreviewRef.current = draggedElementRef.current.cloneNode(true)
      dragPreviewRef.current.style.opacity = '0.6'
      dragPreviewRef.current.style.pointerEvents = 'none'
      dragPreviewRef.current.style.transition = 'transform 0.5s ease-in-out'

      if (currentTarget.classList.contains('columnBoard')) {
        if (draggedElementRef.current) {
          currentTarget.appendChild(dragPreviewRef.current)
        }
      } else if (currentTarget.classList.contains('cardDown')) {
        if (draggedElementRef.current) {
          currentTarget.parentNode.insertAdjacentElement(
            'afterend',
            dragPreviewRef.current
          )
        }
      }
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()

    // const { currentTarget } = e

    if (dragPreviewRef.current) dragPreviewRef.current.remove()
    dragPreviewRef.current = null
  }

  const handleDragEnd = () => {
    draggedElementRef.current = null
    sourceContainer.current = null
    if (dragPreviewRef.current) dragPreviewRef.current.remove()
    dragPreviewRef.current = null
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
        draggedElementRef,
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

// import { createContext, useRef, useState } from 'react'

// export const DragContext = createContext()

// // eslint-disable-next-line react/prop-types
// export const DragProvider = ({ children }) => {
//   const draggedElementRef = useRef(null)
//   const dragPreviewRef = useRef(null)
//   let sourceContainer = null

//   const [draggedPosition, setDraggedPosition] = useState(null) // Guardar la posición (antes o después)

//   const handleDragStart = (e) => {
//     draggedElementRef.current = e.target
//     sourceContainer = draggedElementRef.current.parentNode
//   }

//   const handleDragEnd = () => {
//     draggedElementRef.current = null
//     dragPreviewRef.current = null
//     sourceContainer = null
//     setDraggedPosition(null) // Limpiar la posición al final del arrastre
//   }

//   const handleDrop = (e) => {
//     e.preventDefault()
//     const { currentTarget } = e

//     // Si hay una tarea siendo arrastrada, la movemos
//     if (sourceContainer && draggedElementRef.current) {
//       sourceContainer.removeChild(draggedElementRef.current)
//     }

//     if (draggedElementRef.current) {
//       const closestTask = getClosestTask(currentTarget, e.clientY)

//       if (closestTask) {
//         // Insertamos la tarea según el flag de proximidad (antes o después)
//         if (draggedPosition === 'before') {
//           currentTarget.insertBefore(draggedElementRef.current, closestTask)
//         } else if (draggedPosition === 'after') {
//           currentTarget.insertBefore(
//             draggedElementRef.current,
//             closestTask.nextSibling
//           )
//         } else {
//           currentTarget.appendChild(draggedElementRef.current) // Por defecto, al final
//         }
//       } else {
//         currentTarget.appendChild(draggedElementRef.current) // Si no hay tareas, al final
//       }
//     }

//     if (dragPreviewRef.current) dragPreviewRef.current.remove()
//     dragPreviewRef.current = null
//   }

//   const handleDragOver = (e) => {
//     e.preventDefault()

//     const { currentTarget } = e

//     if (draggedElementRef.current && !dragPreviewRef.current) {
//       // Clona el nodo y lo guarda en dragPreviewRef
//       dragPreviewRef.current = draggedElementRef.current.cloneNode(true)
//       dragPreviewRef.current.style.opacity = '0.6'
//       dragPreviewRef.current.style.pointerEvents = 'none'
//       dragPreviewRef.id = 'drag-preview'

//       const closestTask = getClosestTask(currentTarget, e.clientY)
//       if (closestTask) {
//         const rect = closestTask.getBoundingClientRect()
//         const mouseY = e.clientY - rect.top
//         const elementHeight = rect.height
//         const proximityZone = elementHeight * 0.2 // 20% del alto del elemento

//         // Establecemos la posición de inserción solo una vez durante dragOver
//         if (mouseY < proximityZone) {
//           setDraggedPosition('before') // Si está en la zona superior
//         } else if (mouseY > elementHeight - proximityZone) {
//           setDraggedPosition('after') // Si está en la zona inferior
//         } else {
//           setDraggedPosition('before') // Por defecto, insertamos antes si está en el medio
//         }

//         // Insertamos el preview según la proximidad calculada
//         if (dragPreviewRef.current) {
//           if (draggedPosition === 'before') {
//             currentTarget.insertBefore(dragPreviewRef.current, closestTask)
//           } else if (draggedPosition === 'after') {
//             currentTarget.insertBefore(
//               dragPreviewRef.current,
//               closestTask.nextSibling
//             )
//           } else {
//             currentTarget.insertBefore(dragPreviewRef.current, closestTask)
//           }
//         }
//       } else {
//         currentTarget.appendChild(dragPreviewRef.current) // Si no hay tareas, lo ponemos al final
//       }
//     }
//   }

//   const handleDragLeave = (e) => {
//     e.preventDefault()
//     if (dragPreviewRef.current) dragPreviewRef.current.remove()
//     dragPreviewRef.current = null
//   }

//   // Función para obtener la tarea más cercana al cursor
//   const getClosestTask = (container, mouseY) => {
//     const tasks = Array.from(container.children)
//     return tasks.find((task) => {
//       const rect = task.getBoundingClientRect()
//       return mouseY >= rect.top && mouseY <= rect.bottom
//     })
//   }

//   return (
//     <DragContext.Provider
//       value={{
//         draggedElementRef,
//         handleDragStart,
//         handleDragEnd,
//         handleDrop,
//         handleDragOver,
//         handleDragLeave
//       }}
//     >
//       {children}
//     </DragContext.Provider>
//   )
// }
