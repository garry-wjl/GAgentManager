import { useAuthStore } from '../store/auth'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const { token, user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const logout = useCallback(() => {
    clearAuth()
    navigate('/login', { replace: true })
  }, [clearAuth, navigate])

  return {
    isAuthenticated: !!token,
    token,
    user,
    logout,
  }
}
