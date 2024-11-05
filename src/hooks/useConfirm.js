import { useState } from 'react'

export const useConfirm = () => {
  const [isVisible, setIsVisible] = useState(false)

  const handleOpen = () => {
    setIsVisible(true)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  return { isVisible, handleOpen, handleClose }
}
