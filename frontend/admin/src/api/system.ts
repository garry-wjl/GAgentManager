import { get, put } from './request'
import type { SystemConfig, SystemParams } from '../types'

export function getSystemConfig() {
  return get<Record<string, unknown>>('/system/config')
}

export function updateSystemConfig(data: Record<string, unknown>) {
  return put('/system/config', data)
}

export function getSystemParams() {
  return get<SystemParams>('/system/params')
}

export function updateSystemParams(data: Partial<SystemParams>) {
  return put('/system/params', data)
}

export function getConfigByKey(key: string) {
  return get<SystemConfig>(`/system/config/${key}`)
}
