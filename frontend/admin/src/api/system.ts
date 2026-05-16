import { get, post } from './request'
import type { SystemConfig, SystemParams } from '../types'

/** 系统配置 API，对齐后端 /api/admin/configs 接口 */

/** 获取所有系统配置列表 */
export function getSystemConfig() {
  return get<Record<string, unknown>[]>('/admin/configs/list', { params: {} })
}

/** 更新单条系统配置 */
export function updateSystemConfig(data: { configKey: string; configValue: string; description?: string }) {
  return post('/admin/configs/update', data)
}

/** 获取所有配置项（以 Map 形式返回） */
export function getSystemParams() {
  return get<Record<string, string>>('/admin/configs/all-as-map', { params: {} })
}

/** 批量更新系统配置 */
export function updateSystemParams(data: Record<string, string>) {
  return post('/admin/configs/batch-update', { configMap: data })
}
