export interface RoleItem {
  roleId: string
  num?: string
  roleCode: string
  roleName: string
  description?: string
  isSystem: boolean
  isEnabled: boolean
  userCount: number
  permissionCount: number
  creator: string
  createTime: string
  updater: string
  updateTime: string
}

export interface PermissionResource {
  resourceId: string
  resourceCode: string
  resourceName: string
  resourceType: '模块' | '菜单' | '按钮' | '接口'
  parentId?: string
  sortOrder: number
  children?: PermissionResource[]
}

export interface PermissionAction {
  actionId: string
  actionCode: string
  actionName: string
  description?: string
}

export interface RolePermission {
  rolePermissionId: string
  roleId: string
  resourceId: string
  actionId: string
  permissionCode: string
  grantType: '允许' | '拒绝'
}

export interface UserRoleAssignment {
  userRoleId: string
  userId: string
  roleId: string
  assignType: '直接分配' | '继承'
  assignTime: string
  assignUser: string
  expireTime?: string
}

export interface UserPermissionResult {
  userId: string
  username: string
  directRoles: string[]
  inheritedRoles: string[]
  allPermissions: string[]
  deniedPermissions: string[]
}
