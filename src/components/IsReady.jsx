import { useEffect } from 'react'
import { useBackendAvailabilityStore } from '../store/BackendAvailability'
import { Loader } from './icons/Loader'

export const IsReady = () => {
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
      //   console.log('Sondeo de salud del backend detenido.')
    }
  }, [])

  return (
    <>
      <div className='flex gap-2 items-center'>
        Servidor
        <div
          aria-label='disponiblidad del backend'
          className={`h-3 w-3 ${isAvailable ? 'bg-green-500' : 'bg-red-500'} rounded-full`}
          title={`${isAvailable ? 'Disponible' : 'No Disponible'}`}
        ></div>
      </div>
      <article
        className={`${isAvailable ? 'hidden' : 'block'} fixed sm:top-[47px] top-[52px] left-0 w-full h-screen md:h-screen z-30 bg-[var(--popup-color)] backdrop-blur-sm bg-opacity-90 flex justify-center items-center`}
      >
        <dialog
          className='relative w-4/5 md:w-1/2 animate-fade p-10
        flex flex-col items-center gap-4 rounded-md bg-transparent'
        >
          <h3 className='self-center text-xl text-center font-bold'>
            🚀 El backend está despertando...
            <span className='text-left font-normal block'>
              (No tengo plan pago 😅, puede tardar un par de minutos)
            </span>
          </h3>
          <div className='w-[10%]'>
            <Loader />
          </div>
        </dialog>
      </article>
    </>
  )
}
