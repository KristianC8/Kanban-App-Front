/* eslint-disable react/prop-types */
import React from 'react'
import { PopUpForm } from './PopUpForm'
import { EditIcon } from './icons/EditIcon'
import { useForm } from '../hooks/useForm'
import { useProjectsStore } from '../store/projects'

export const UpdateProject = ({ title, description, id }) => {
  const initialForm = {
    nombreProyecto: title,
    descripciónProyecto: description
  }

  const validateForm = (form) => {
    let errors = {}
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/

    if (!form.nombreProyecto.trim()) {
      errors.nombreProyecto = 'El Nombre del Proyecto es requerido'
    } else if (!regexName.test(form.nombreProyecto.trim())) {
      errors.nombreProyecto =
        'Este campo solo acepta letras y espacios en blanco'
    }

    if (!form.descripciónProyecto.trim()) {
      errors.descripciónProyecto = 'Se requiere una corta descripción'
    }

    return errors
  }

  const {
    formstate,
    errors,
    initialValidation,
    onInputChange,
    handleBlur,
    handleKeyUp,
    initForm,
    initValidation
  } = useForm(initialForm, validateForm)
  const { nombreProyecto, descripciónProyecto } = formstate

  const updateProject = useProjectsStore((state) => state.updateProject)

  const handleSubmit = (e) => {
    const endPointUpdate = `http://localhost:8080/kanban-app/proyectos/${id}`
    e.preventDefault()
    updateProject(endPointUpdate, formstate, id).then(() => initValidation())
  }

  return (
    <PopUpForm
      title={'Editar Proyecto'}
      stylesBtn={''}
      OpenBtn={<EditIcon />}
      textBtn={'Editar'}
      handleSubmit={handleSubmit}
      functionClose={initForm}
      initalValidation={initialValidation}
      errors={errors}
    >
      <div className='flex flex-col gap-1'>
        <label className='text-sm translate-y-2' htmlFor='nombreProyecto'>
          Nombre del Proyecto:
        </label>
        <input
          className='text-[#c1c1c1]  px-2 py-1 bg-[#212121] outline-none border-b border-[#303030] focus:border-[var(--principal-color)]'
          type='text'
          name='nombreProyecto'
          id='nombreProyecto'
          value={nombreProyecto}
          onChange={onInputChange}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          autoComplete='off'
        />
        {errors.nombreProyecto && (
          <span className='text-[#ff3445]'>{errors.nombreProyecto}</span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-sm translate-y-2' htmlFor='descripciónProyecto'>
          Descripción:
        </label>
        <textarea
          className='text-[#c1c1c1]  px-2 py-1 bg-[#212121] outline-none border-b border-[#303030] focus:border-[var(--principal-color)] resize-none'
          name='descripciónProyecto'
          id='descripciónProyecto'
          value={descripciónProyecto}
          onChange={onInputChange}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
        />
        {errors.descripciónProyecto && (
          <span className='text-[#ff3445]'>{errors.descripciónProyecto}</span>
        )}
      </div>
    </PopUpForm>
  )
}
