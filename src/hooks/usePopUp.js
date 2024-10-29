import { useState } from 'react'

export const usePopUp = (functionClose) => {
  const [isVisible, setIsVisible] = useState(false)

  const handleBtnOpen = () => {
    setIsVisible(true)
  }

  const handleBtnCancel = () => {
    setIsVisible(false)
    functionClose()
  }

  const handleClosePopup = () => {
    setIsVisible(false)
  }

  return {
    isVisible,
    handleBtnOpen,
    handleBtnCancel,
    handleClosePopup
  }
}
