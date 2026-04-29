import { get, post } from './request'
import type { UserInfo } from '../types'

export interface LoginParams {
  loginAccount: string
  password: string
  rememberMe?: boolean
  captcha?: string
}

export function login(data: LoginParams) {
  return post<{ token: string; user: UserInfo }>('/auth/login', data)
}

export function logout() {
  return post('/auth/logout')
}

export function getCurrentUser() {
  return get<UserInfo>('/auth/current')
}

export function sendResetCode(email: string) {
  return post('/auth/reset-code', { email })
}

export function resetPassword(data: { email: string; verifyCode: string; newPassword: string }) {
  return post('/auth/reset-password', data)
}
