import { create } from 'zustand'
import type { UserVO } from '../types/user'

interface AuthState {
  token: string | null
  user: UserVO | null
  setToken: (token: string) => void
  setUser: (user: UserVO) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  user: null,
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token })
  },
  setUser: (user) => set({ user }),
  clearAuth: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },
  isAuthenticated: () => !!get().token,
}))
