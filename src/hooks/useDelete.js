import { helpHTTP } from '../helpers/helpHTTP'
import { useState } from 'react'

export const useDelete = (endpointDelete, getItems) => {
  const [isVisible, setIsVisible] = useState(false)

  const handleOpen = () => {
    setIsVisible(true)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleDelete = () => {
    helpHTTP()
      .del(endpointDelete)
      .then(() => {
        getItems()
        setIsVisible(false)
      })
  }

  return { isVisible, handleOpen, handleDelete, handleClose }
}
