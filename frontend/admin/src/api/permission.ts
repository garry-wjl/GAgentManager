import { get, post } from './request'
import type { RoleItem, PermissionResource, PermissionAction, UserRoleAssignment, PageResult } from '../types'

/** RBAC 权限管理 API，对齐后端 /api/admin/rbac 接口 */

export function getRoles(params?: Record<string, unknown>) {
  return get<PageResult<RoleItem>>('/admin/rbac/role/list', { params })
}

export function getRole(id: string) {
  return get<RoleItem>('/admin/rbac/role/get', { params: { id } })
}

export function createRole(data: { roleCode: string; roleName: string; description?: string; permissions: string[]; isEnabled: boolean }) {
  return post<RoleItem>('/admin/rbac/role/create', data)
}

export function updateRole(data: { id: string; roleCode: string; roleName: string; description?: string; isEnabled: boolean }) {
  return post<RoleItem>('/admin/rbac/role/update', data)
}

export function deleteRole(num: string) {
  return post('/admin/rbac/role/delete', null, { params: { num } })
}

export function enableRole(num: string) {
  return post('/admin/rbac/role/enable', null, { params: { num } })
}

export function disableRole(num: string) {
  return post('/admin/rbac/role/disable', null, { params: { num } })
}

export function getPermissionResources() {
  return get<PermissionResource[]>('/admin/rbac/permissions/tree')
}

export function getPermissionActions() {
  return get<PermissionAction[]>('/admin/rbac/permissions/actions')
}

export function setRolePermissions(roleId: string, permissions: { resourceId: string; actionId: string; grantType: string }[]) {
  return post('/admin/rbac/role/assign-permissions', { roleId: Number(roleId), permissions })
}

export function getRoleUsers(roleId: string) {
  return get<UserRoleAssignment[]>('/admin/rbac/role/users', { params: { roleId: Number(roleId) } })
}

export function assignUserToRole(data: { userId: string; roleId: string; expireTime?: string }) {
  return post('/admin/rbac/role/assign-users', data)
}

export function removeUserFromRole(userId: string, roleId: string) {
  return post('/admin/rbac/role/remove-user', null, { params: { userId: Number(userId), roleId: Number(roleId) } })
}
