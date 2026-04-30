export interface UserInfo {
  userId: string
  username: string
  realName: string
  nickname?: string
  email: string
  phone?: string
  avatar?: string
  department?: string
  roleNames: string[]
  source: string
  createTime: string
}

export interface UserListItem {
  userId: string
  num?: string
  username: string
  realName: string
  nickname?: string
  phone?: string
  email: string
  source: UserSource
  status: UserStatus
  roleNames: string[]
  department?: string
  avatar?: string
  notes?: string
  mfaEnabled: boolean
  lastLoginTime?: string
  lastLoginIp?: string
  creator?: string
  createTime: string
  updater: string
  updateTime: string
  expireTime?: string
  loginFailCount: number
}

export type UserStatus = '已启用' | '已禁用' | '已离职' | '已删除'
export type UserSource = '手动创建' | '导入' | 'SSO' | '邀请注册' | 'API创建'

export interface UserFormValues {
  username: string
  password?: string
  confirmPassword?: string
  realName: string
  nickname?: string
  phone?: string
  email: string
  source: UserSource
  department?: string
  status: '已启用' | '已禁用'
  expireTime?: string
  mfaEnabled?: boolean
  roleNames?: string[]
  userGroups?: string[]
  notes?: string
}
