import { useState } from 'react'
import { useGetProjects } from './useGetProjects'

export const useForm = (intialForm = {}, validateForm) => {
  const [formstate, setFormstate] = useState(intialForm)
  const [errors, setErrors] = useState({})
  const [initialValidation, setInitialValidation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { getProjects } = useGetProjects

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
  }

  const postData = async (endPoint, sendBody) => {
    try {
      const response = await fetch(endPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(sendBody)
      })
      if (!response.ok)
        throw `Error al acceder a la api: ${response.status} ${response.statusText}`
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (e) => {
    console.log(JSON.stringify(formstate))
    e.preventDefault()
    setIsLoading(true)
    setFormstate(intialForm)
    postData('http://localhost:8080/kanban-app/proyectos', formstate).then(
      (res) => {
        setIsLoading(false)
        setInitialValidation(false)
        console.log(res)
        getProjects()
      }
    )
  }

  return {
    formstate,
    errors,
    isLoading,
    initialValidation,
    onInputChange,
    handleBlur,
    handleKeyUp,
    handleSubmit,
    initForm
  }
}
