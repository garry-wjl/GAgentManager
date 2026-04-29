import { get, post, put, del } from './request'
import type { UserListItem, UserFormValues, PageResult } from '../types'

export function getUsers(params: Record<string, unknown>) {
  return get<PageResult<UserListItem>>('/users', { params })
}

export function getUser(id: string) {
  return get<UserListItem>(`/users/${id}`)
}

export function createUser(data: UserFormValues) {
  return post<UserListItem>('/users', data)
}

export function updateUser(id: string, data: UserFormValues) {
  return put<UserListItem>(`/users/${id}`, data)
}

export function deleteUser(id: string) {
  return del(`/users/${id}`)
}

export function enableUser(id: string) {
  return post(`/users/${id}/enable`)
}

export function disableUser(id: string) {
  return post(`/users/${id}/disable`)
}

export function resignUser(id: string) {
  return post(`/users/${id}/resign`)
}

export function resetUserPassword(id: string, data: { newPassword: string; notifyMethod: string; expireHours?: number }) {
  return post(`/users/${id}/reset-password`, data)
}

export function batchUsers(action: string, ids: string[]) {
  return post('/users/batch', { action, ids })
}
