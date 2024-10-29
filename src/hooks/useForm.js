import { useState } from 'react'

export const useForm = (intialForm = {}, validateForm) => {
  const [formstate, setFormstate] = useState(intialForm)
  const [errors, setErrors] = useState({})
  const [initialValidation, setInitialValidation] = useState(false)

  const onInputChange = (e) => {
    const { name, value } = e.target
    setFormstate({
      ...formstate,
      [name]: value
    })
  }

  const handleBlur = (e) => {
    onInputChange(e)
    setErrors(validateForm(formstate))
    setInitialValidation(true)
  }

  const handleKeyUp = (e) => {
    onInputChange(e)
    setErrors(validateForm(formstate))
    setInitialValidation(true)
  }

  const initForm = () => {
    setFormstate(intialForm)
    setErrors({})
  }

  const initValidation = () => {
    setInitialValidation(false)
  }

  return {
    formstate,
    errors,
    initialValidation,
    onInputChange,
    handleBlur,
    handleKeyUp,
    initForm,
    initValidation
  }
}
