import { useForm } from '../hooks/useForm'
import { PopUp } from './PopUp'

export const CreateProject = () => {
  const initialForm = {
    nombreProyecto: '',
    descripciónProyecto: ''
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
    isLoading,
    initialValidation,
    onInputChange,
    handleBlur,
    handleKeyUp,
    handleSubmit,
    initForm
  } = useForm(initialForm, validateForm)
  const { nombreProyecto, descripciónProyecto } = formstate

  return (
    <>
      <PopUp
        title={'Creat Proyecto'}
        stylesBtn={
          'p-3 bg-gradient-to-r from-[#e42f1e] to-[#e74435] mb-4 rounded-md font-bold'
        }
        OpenBtn={'Crear Proyecto'}
        textBtn={'Crear'}
        handleSubmit={handleSubmit}
        functionClose={initForm}
      >
        <div className='flex flex-col gap-1'>
          <label className='' htmlFor='nombreProyecto'>
            Nombre del Proyecto:
          </label>
          <input
            className='rounded-md px-2 py-1 bg-slate-300 text-zinc-800'
            type='text'
            name='nombreProyecto'
            id='nombreProyecto'
            value={nombreProyecto}
            onChange={onInputChange}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
          />
          {errors.nombreProyecto && (
            <span className='text-[#ff3445]'>{errors.nombreProyecto}</span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <label className='' htmlFor='descripciónProyecto'>
            Descripción:
          </label>
          <textarea
            className='rounded-md px-2 py-1 bg-slate-300 text-zinc-800 resize-none'
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
      </PopUp>
    </>
  )
}
