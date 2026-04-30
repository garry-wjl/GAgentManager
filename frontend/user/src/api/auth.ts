import { post } from './request'
import type { ApiResponse } from '../types/api'
import type { UserVO } from '../types/user'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: UserVO
}

export function login(data: LoginParams) {
  return post<LoginResult>('/auth/login', data)
}

export function sendCaptcha(email: string) {
  return post<ApiResponse<void>>('/auth/send-captcha', { email })
}

export function resetPassword(data: { email: string; captcha: string; newPassword: string }) {
  return post<ApiResponse<void>>('/auth/reset-password', data)
}

export function getCurrentUser() {
  return post<ApiResponse<UserVO>>('/auth/current-user')
}
