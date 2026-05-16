import { get, post } from './request'
import type { UserListItem, UserFormValues, PageResult } from '../types'

/** 用户管理 API，对齐后端接口：
 * Query: /api/user/query/*
 * Command: /api/user/command/*
 */

export function getUsers(params: Record<string, unknown>) {
  return get<PageResult<UserListItem>>('/user/query/list', { params })
}

export function getUser(id: string) {
  return get<UserListItem>('/user/query/get', { params: { id } })
}

export function getUserByNum(num: string) {
  return get<UserListItem>('/user/query/detail', { params: { num } })
}

export function checkUsername(username: string) {
  return get<boolean>('/user/query/check-username', { params: { username } })
}

export function createUser(data: UserFormValues) {
  return post<UserListItem>('/user/command/create', data)
}

export function updateUser(data: UserFormValues & { id: string }) {
  return post<UserListItem>('/user/command/update', data)
}

export function deleteUser(num: string) {
  return post('/user/command/delete', null, { params: { num } })
}

export function enableUser(num: string) {
  return post('/user/command/activate', null, { params: { num } })
}

export function disableUser(num: string) {
  return post('/user/command/deactivate', null, { params: { num } })
}

export function resignUser(num: string) {
  return post('/user/command/resign', null, { params: { num } })
}

export function resetUserPassword(num: string, newPassword: string) {
  return post('/user/command/reset-password', null, { params: { num, newPassword } })
}

export function batchCreateUsers(params: { users: UserFormValues[] }) {
  return post('/user/command/batch-create', params.users)
}
