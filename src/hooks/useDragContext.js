import { useContext } from 'react'
import { DragContext } from '../context/dragContext'

export const useDragContext = () => {
  const DragContextValues = useContext(DragContext)

  if (DragContextValues === undefined) {
    throw new Error('useDragContext no puede usarse sin un provider')
  }

  return DragContextValues
}
