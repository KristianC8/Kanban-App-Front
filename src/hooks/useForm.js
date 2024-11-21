import { useState } from 'react'

export const useForm = (intialForm = {}, validateForm) => {
  const [formstate, setFormstate] = useState(intialForm)
  const [errors, setErrors] = useState({})
  const [initialValidation, setInitialValidation] = useState(false)

  const onInputChange = (e) => {
    setInitialValidation(true)
    const { name, value, type } = e.target

    let adjustedValue = value

    if (type === 'date' && value) {
      const fechaSeleccionada = new Date(e.target.value)
      const dia = String(fechaSeleccionada.getUTCDate()).padStart(2, '0')
      const mes = String(fechaSeleccionada.getMonth() + 1).padStart(2, '0')
      const año = String(fechaSeleccionada.getFullYear())
      adjustedValue = `${año}-${mes}-${dia}`
    }

    setFormstate({
      ...formstate,
      [name]: adjustedValue
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
