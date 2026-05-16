import { get, post } from './request'
import type { ApiResponse, PageResult } from '../types/api'
import type { UserProfile, ChangePasswordParams } from '../types/user'
import type { SessionVO } from '../types/session'

export function getProfile() {
  return get<ApiResponse<UserProfile>>('/user/profile')
}

export function updateProfile(data: UserProfile) {
  return post<ApiResponse<void>>('/user/profile', data)
}

export function changePassword(data: ChangePasswordParams) {
  return post<ApiResponse<void>>('/user/change-password', data)
}

export function getInteractionHistory() {
  return get<ApiResponse<PageResult<SessionVO>>>('/user/interaction-history')
}
