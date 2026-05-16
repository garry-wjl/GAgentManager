export interface UserVO {
  userId: string
  loginAccount: string
  nickName: string
  phone: string
  email: string
  avatar: string
  status: '正常' | '禁用'
  createTime: string
}

export interface UserProfile {
  nickName: string
  phone: string
  email: string
  avatar?: string
}

export interface ChangePasswordParams {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
