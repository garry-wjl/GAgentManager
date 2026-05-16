export interface UserDeviceVO {
  num: string
  deviceName: string
  ipAddress: string
  loginTime: string
  lastActiveTime: string
  isOnline: boolean
}

export interface KickOutDeviceParams {
  deviceNum: string
}
