import { get, post } from './request'
import type { UserInfo } from '../types'

export interface LoginParams {
  username: string
  password: string
  rememberMe?: boolean
  captcha?: string
}

/** 后端 LoginVO 实际返回的字段 */
export interface LoginVO {
  accessToken: string
  refreshToken: string
  expiresIn: number
  userId: number
  username: string
  realName?: string
  avatar?: string
  mfaRequired: boolean
  user?: UserInfo
}

export function login(data: LoginParams) {
  return post<LoginVO>('/auth/login', data)
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
