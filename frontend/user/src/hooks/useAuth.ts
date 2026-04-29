import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export function useAuth() {
  const { token, user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const logout = () => {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return { token, user, logout }
}
