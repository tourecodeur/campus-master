'use client'

import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
export type UiRole = 'admin' | 'enseignant' | 'etudiant'


export type AuthUser = {
  id: number
  email: string
  role: UiRole
  backendRole?: string // ex: ROLE_ADMIN
  nom?: string
  prenom?: string
}

export type AuthState = {
  token: string | null
  role: UiRole | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (token: string, role: UiRole, user: AuthUser) => void
  logout: () => void
}

// ✅ Storage safe (évite erreurs SSR)
const storage: StateStorage =
  typeof window !== 'undefined'
    ? localStorage
    : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token: string, role: UiRole, user: AuthUser) =>
        set(() => ({ token, role, user, isAuthenticated: true })),

      logout: () => set(() => ({ token: null, role: null, user: null, isAuthenticated: false })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        token: state.token,
        role: state.role,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// ✅ IMPORTANT : export default pour pouvoir faire `import useAuthStore from '@/lib/store'`
export default useAuthStore
