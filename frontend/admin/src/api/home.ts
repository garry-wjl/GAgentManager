import { get, post } from './request'

/** 获取仪表盘统计数据 */
export function getDashboard() {
  return get<Record<string, unknown>>('/home/dashboard')
}

/** 获取公告列表 */
export function getNotices(params?: Record<string, unknown>) {
  return get<Record<string, unknown>[]>('/home/notices', { params })
}

/** 全局搜索 */
export function search(keyword: string) {
  return get<Record<string, unknown>>('/home/search', { params: { keyword } })
}
