import { get, post } from './request'
import type { ApiResponse } from '../types/api'
import type { UserDeviceVO, KickOutDeviceParams } from '../types/device'

export function listDevices() {
  return get<ApiResponse<UserDeviceVO[]>>('/api/device/list')
}

export function kickOutDevice(data: KickOutDeviceParams) {
  return post<ApiResponse<void>>('/api/device/kick-out', data)
}
