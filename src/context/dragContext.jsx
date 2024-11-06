import { createContext, useRef } from 'react'

export const DragContext = createContext()

// eslint-disable-next-line react/prop-types
export const DragProvider = ({ children }) => {
  const draggedElementRef = useRef(null)
  const dragPreviewRef = useRef(null)

  let sourceContainer = null

  const handleDragStart = (e) => {
    // console.log('Drag Start', dragElement)
    draggedElementRef.current = e.target
    sourceContainer = draggedElementRef.current.parentNode
    console.log(dragPreviewRef)
    // e.dataTransfer.setData('application/json', JSON.stringify(draggedElement))
    // console.log(sourceContainer)
  }
  const handleDragEnd = () => {
    // console.log('Drag End', e.target)
    draggedElementRef.current = null
    dragPreviewRef.current = null
    sourceContainer = null
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const { currentTarget } = e
    // console.log('current', currentTarget)
    // const element = dataTransfer.getData('json/application')

    if (sourceContainer && draggedElementRef.current) {
      sourceContainer.removeChild(draggedElementRef.current)
    }

    if (draggedElementRef.current) {
      currentTarget.appendChild(draggedElementRef.current)
    }

    currentTarget.removeChild(dragPreviewRef.current)
    dragPreviewRef.current = null
  }

  const handleDragOver = (e) => {
    e.preventDefault()

    const { currentTarget } = e

    // if (sourceContainer === currentTarget) return

    if (draggedElementRef.current && !dragPreviewRef.current) {
      // Clona el nodo y lo guarda en dragPreviewRef
      dragPreviewRef.current = draggedElementRef.current.cloneNode(true)
      dragPreviewRef.current.style.opacity = '0.6'
      dragPreviewRef.current.style.pointerEvents = 'none'
      dragPreviewRef.id = 'drag-preview'
      currentTarget.appendChild(dragPreviewRef.current)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()

    const { currentTarget } = e

    currentTarget.removeChild(dragPreviewRef.current)
    dragPreviewRef.current = null
  }

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
