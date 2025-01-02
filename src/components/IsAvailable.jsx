import { useEffect } from 'react'
import { useBackendAvailabilityStore } from '../store/BackendAvailability'
import { Loader } from './icons/Loader'

export const IsAvailable = () => {
  const isAvailable = useBackendAvailabilityStore((state) => state.isAvailable)
  const isBackendAvailable = useBackendAvailabilityStore(
    (state) => state.checkBackendAvailable
  )
  const mantainActive = useBackendAvailabilityStore(
    (state) => state.mantainActive
  )

  useEffect(() => {
    isBackendAvailable()
    const healthCheckInterval = setInterval(mantainActive, 14 * 60 * 1000)

    return () => {
      clearInterval(healthCheckInterval)
      console.log('Sondeo de salud del backend detenido.')
    }
  }, [])

  return (
    <>
      <div className='flex gap-2 items-center'>
        Backend
        <div
          aria-label='disponiblidad del backend'
          className={`h-3 w-3 ${isAvailable ? 'bg-green-500' : 'bg-red-500'} rounded-full`}
          title={`${isAvailable ? 'Disponible' : 'No Disponible'}`}
        ></div>
      </div>
      <article
        className={`${isAvailable ? 'hidden' : 'block'} fixed top-0 left-0 w-full h-screen md:h-screen z-30 bg-[#242424] backdrop-blur-sm bg-opacity-90 flex justify-center items-center`}
      >
        <dialog
          className='relative w-4/5 md:w-96 animate-fade p-10
        flex flex-col items-center gap-4 rounded-md bg-transparent'
        >
          <h3 className='self-center text-xl text-center font-bold'>
            El servidor se está activando, por favor espera un momento...
          </h3>
          <div className='w-[20%]'>
            <Loader />
          </div>
        </dialog>
      </article>
    </>
  )
}
