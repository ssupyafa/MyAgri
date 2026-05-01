import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      logs: [],
      setLogs: (logs) => set({ logs }),
      addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
      isOffline: !navigator.onLine,
      setOffline: (isOffline) => set({ isOffline }),
    }),
    {
      name: 'arboretum-storage',
    }
  )
)

export default useStore