import { get, post, put, del } from './request'
import type { RoleItem, PermissionResource, PermissionAction, UserRoleAssignment, PageResult } from '../types'

export function getRoles(params?: Record<string, unknown>) {
  return get<PageResult<RoleItem>>('/roles', { params })
}

export function getRole(id: string) {
  return get<RoleItem>(`/roles/${id}`)
}

export function createRole(data: { roleCode: string; roleName: string; description?: string; permissions: string[]; isEnabled: boolean }) {
  return post<RoleItem>('/roles', data)
}

export function updateRole(id: string, data: { roleName: string; description?: string; permissions: string[]; isEnabled: boolean }) {
  return put<RoleItem>(`/roles/${id}`, data)
}

export function deleteRole(id: string) {
  return del(`/roles/${id}`)
}

export function enableRole(id: string) {
  return post(`/roles/${id}/enable`)
}

export function disableRole(id: string) {
  return post(`/roles/${id}/disable`)
}

export function copyRole(id: string, data: { roleCode: string; roleName: string }) {
  return post<RoleItem>(`/roles/${id}/copy`, data)
}

export function getPermissionResources() {
  return get<PermissionResource[]>('/permissions/resources')
}

export function getPermissionActions() {
  return get<PermissionAction[]>('/permissions/actions')
}

export function setRolePermissions(roleId: string, permissions: { resourceId: string; actionId: string; grantType: string }[]) {
  return post(`/roles/${roleId}/permissions`, permissions)
}

export function getRoleUsers(roleId: string) {
  return get<UserRoleAssignment[]>(`/roles/${roleId}/users`)
}

export function assignUserToRole(data: { userId: string; roleId: string; expireTime?: string }) {
  return post('/roles/users', data)
}

export function batchAssignUsersToRole(data: { userIds: string[]; roleId: string }) {
  return post('/roles/users/batch', data)
}

export function removeUserFromRole(userRoleId: string) {
  return del(`/roles/users/${userRoleId}`)
}
