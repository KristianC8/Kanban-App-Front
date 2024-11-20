import { useForm } from '../hooks/useForm'
import { useProjectsStore } from '../store/projects'
import { PopUpForm } from './PopUpForm'

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
    initialValidation,
    onInputChange,
    handleBlur,
    handleKeyUp,
    initForm,
    initValidation
  } = useForm(initialForm, validateForm)
  const { nombreProyecto, descripciónProyecto } = formstate

  const addProject = useProjectsStore((state) => state.addProject)
  const endPointCreate = 'http://localhost:8080/kanban-app/proyectos'

  const handleSubmit = (e) => {
    e.preventDefault()
    initForm()
    addProject(endPointCreate, formstate).then(() => {
      initValidation()
    })
  }

  return (
    <>
      <PopUpForm
        title={'Crear Proyecto'}
        stylesBtn={
          'p-3 bg-gradient-to-r from-[var(--principal-color)] to-[#e03c3c] mb-4 rounded-md font-bold'
        }
        OpenBtn={'Crear Proyecto'}
        textBtn={'Crear'}
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
            className='text-[#c1c1c1] px-2 py-1 bg-[#212121] outline-none border-b border-[#303030] focus:border-[var(--principal-color)] h-fit'
            type='text'
            name='nombreProyecto'
            id='nombreProyecto'
            placeholder='Cual es tu Proyecto?'
            value={nombreProyecto}
            onChange={onInputChange}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            autoComplete='off'
            maxLength={'40'}
          />
          {errors.nombreProyecto && (
            <span className='text-[#ff3445]'>{errors.nombreProyecto}</span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <label
            className='text-sm translate-y-2'
            htmlFor='descripciónProyecto'
          >
            Descripción:
          </label>
          <textarea
            className='text-[#c1c1c1] px-2 py-1 bg-[#212121] outline-none border-b border-[#303030] focus:border-[var(--principal-color)] resize-none h-fit'
            name='descripciónProyecto'
            id='descripciónProyecto'
            placeholder='Describe tu proyecto de forma breve'
            value={descripciónProyecto}
            onChange={onInputChange}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            maxLength={'70'}
          />
          {errors.descripciónProyecto && (
            <span className='text-[#ff3445]'>{errors.descripciónProyecto}</span>
          )}
        </div>
      </PopUpForm>
    </>
  )
}
