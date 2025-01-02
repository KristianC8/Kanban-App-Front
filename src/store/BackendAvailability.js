import { create } from 'zustand'

export const useBackendAvailabilityStore = create((set) => ({
  isAvailable: false,
  checkBackendAvailable: async () => {
    const fetchWithTimeout = (url, options, timeout = 10000) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Timeout: El servidor no responde')),
            timeout
          )
        )
      ])
    }

    let isAvailable = false

    while (!isAvailable) {
      try {
        const availability = await fetchWithTimeout(
          'https://kanban-api-djkd.onrender.com/health'
        )
        if (!availability.ok) throw new Error('Servidor no disponible')
        isAvailable = true
        set({ isAvailable: true })
      } catch (error) {
        console.log(error, 'reintentando en 5 segundos')
        await new Promise((resolve) => setTimeout(resolve, 5000))
        set({ isAvailable: false })
      }
    }
  },
  mantainActive: async () => {
    try {
      const response = await fetch(
        'https://kanban-api-djkd.onrender.com/health'
      )
      if (!response.ok) throw new Error('No es posible mantener activa la API')
      console.log('manteniendo')
    } catch (error) {
      console.log(error)
    }
  }
}))
