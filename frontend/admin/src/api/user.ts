import { get, post } from './request'
import type { UserListItem, UserFormValues, PageResult } from '../types'

/** 用户管理 API，对齐后端 /api/admin/users 接口 */

export function getUsers(params: Record<string, unknown>) {
  return get<PageResult<UserListItem>>('/admin/users/list', { params })
}

export function getUser(id: string) {
  return get<UserListItem>('/admin/users/get', { params: { id } })
}

export function createUser(data: UserFormValues) {
  return post<UserListItem>('/admin/users/create', data)
}

export function updateUser(data: UserFormValues & { id: string }) {
  return post<UserListItem>('/admin/users/update', data)
}

export function deleteUser(num: string) {
  return post('/admin/users/delete', null, { params: { num } })
}

export function enableUser(num: string) {
  return post('/admin/users/activate', null, { params: { num } })
}

export function disableUser(num: string) {
  return post('/admin/users/deactivate', null, { params: { num } })
}

export function resignUser(num: string) {
  return post('/admin/users/resign', null, { params: { num } })
}

export function resetUserPassword(num: string, newPassword: string) {
  return post('/admin/users/reset-password', null, { params: { num, newPassword } })
}

export function batchCreateUsers(params: { users: UserFormValues[] }) {
  return post('/admin/users/batch-create', params.users)
}
