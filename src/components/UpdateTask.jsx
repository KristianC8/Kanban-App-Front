/* eslint-disable react/prop-types */
import { PopUpForm } from './PopUpForm'
import { useForm } from '../hooks/useForm'
// import { useTasksContext } from '../hooks/useTasksContext'
import { EditIcon } from './icons/EditIcon'
import { useTasksStore } from '../store/tasks'

export const UpdateTask = ({
  id,
  title,
  description,
  state,
  priority,
  date
}) => {
  // const { project, updateTask } = useTasksContext()
  const project = useTasksStore((state) => state.project)
  const updateTask = useTasksStore((state) => state.updateTask)

  const initialForm = {
    id: id,
    titulo: title,
    descripcion: description,
    estado: state,
    prioridad: priority,
    fechaPendiente: date,
    posicion: 0
  }

  function getMinActualDate() {
    const date = new Date()
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const año = String(date.getFullYear())
    return `${año}-${mes}-${dia}`
  }

  const validateForm = (form) => {
    let errors = {}
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/

    if (!form.titulo.trim()) {
      errors.titulo = 'El Nombre de la tarea es requerido'
    } else if (!regexName.test(form.titulo.trim())) {
      errors.titulo = 'Este campo solo acepta letras y espacios en blanco'
    }

    if (!form.descripcion.trim()) {
      errors.descripcion = 'Se requiere una descripción'
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
  const { titulo, descripcion, estado, prioridad, fechaPendiente } = formstate

  const handelSubmit = (e) => {
    // console.log(JSON.stringify(formstate))
    const endpointUpdate = `http://localhost:8080/kanban-app/tareas/${id}`
    e.preventDefault()
    // initForm()
    updateTask(endpointUpdate, formstate, id).then(() => {
      initValidation()
    })
  }

  return (
    <PopUpForm
      title={'Editar Tarea'}
      stylesBtn={'z-10'}
      OpenBtn={<EditIcon />}
      textBtn={'Editar'}
      errors={errors}
      initalValidation={initialValidation}
      functionClose={initForm}
      handleSubmit={handelSubmit}
    >
      <div className='flex flex-col gap-1'>
        <label htmlFor='titleTask' className='text-sm translate-y-2'>
          Titulo:
        </label>
        <input
          className='text-[#c1c1c1] px-2 py-1 bg-[#212121] outline-none border-b border-[#303030] focus:border-[var(--principal-color)]'
          placeholder='Cual es tu tarea?'
          id='titleTask'
          name='titulo'
          type='text'
          onChange={onInputChange}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
          value={titulo}
          autoComplete='off'
        />
        {errors.titulo && (
          <span className='text-[#ff3445]'>{errors.titulo}</span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label htmlFor='descriptionTask' className='text-sm translate-y-1'>
          Descripción:
        </label>
        <textarea
          className='text-[#c1c1c1]  px-2 py-1 bg-[#212121] outline-none border-b border-[#303030] focus:border-[var(--principal-color)] resize-none'
          name='descripcion'
          id='descriptionTask'
          placeholder='Describe tu tarea con más detalle'
          onChange={onInputChange}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
          value={descripcion}
          autoComplete='off'
        ></textarea>
        {errors.descripcion && (
          <span className='text-[#ff3445]'>{errors.descripcion}</span>
        )}
      </div>
      <div className='flex gap-8 flex-wrap'>
        <div className='flex flex-col gap-1'>
          <label htmlFor='stateTask' className='text-sm translate-y-2'>
            Estado:
          </label>
          <select
            className='text-[#c1c1c1] px-2 py-1 bg-[#212121] outline-none border-b border-[#303030] focus:border-[var(--principal-color)]'
            name='estado'
            id='stateTask'
            onChange={onInputChange}
            onBlur={handleBlur}
            value={estado}
          >
            <option className=' appearance-none' value='todo'>
              Por Hacer
            </option>
            <option className=' appearance-none' value='inProgress'>
              En curso
            </option>
            <option className=' appearance-none' value='done'>
              Terminado
            </option>
          </select>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='priorityTask' className='text-sm translate-y-2'>
            Prioridad:
          </label>
          <select
            className='text-[#c1c1c1]  px-2 py-1 bg-[#212121] outline-none border-b border-[#303030] focus:border-[var(--principal-color)]'
            name='prioridad'
            id='priorityTask'
            onChange={onInputChange}
            onBlur={handleBlur}
            value={prioridad}
          >
            <option value='low'>Baja</option>
            <option value='medium'>Media</option>
            <option value='high'>Alta</option>
          </select>
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <label htmlFor='dateTask' className='text-sm translate-y-2'>
          Fecha estimada:
        </label>
        <input
          className='text-[#c1c1c1] px-2 py-1 bg-[#212121] outline-none border-b border-[#303030] focus:border-[var(--principal-color)]'
          type='date'
          name='fechaPendiente'
          id='dateTask'
          min={getMinActualDate()}
          onChange={onInputChange}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
          value={fechaPendiente}
        />
      </div>
      <div>
        <span className='text-sm translate-y-2 text-[#A2A2A2]'>Proyecto: </span>
        <span className=' text-[.75rem] text-[#A2A2A2]'>
          {project.nombreProyecto.toUpperCase()}
        </span>
      </div>
    </PopUpForm>
  )
}
