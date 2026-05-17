import { get, post } from './request'
import type { MCPItem, MCPFormValues, PageResult } from '../types'

/** MCP 管理 API，对齐后端 /api/admin/mcps 接口 */

export function getMCPs(params?: Record<string, unknown>) {
  return get<PageResult<MCPItem>>('/admin/mcps/list', { params })
}

export function getMCP(id: string) {
  return get<MCPItem>('/admin/mcps/get', { params: { id } })
}

export function createMCP(data: MCPFormValues) {
  return post<MCPItem>('/admin/mcps/create', data)
}

export function updateMCP(data: MCPFormValues & { id: string }) {
  return post<MCPItem>('/admin/mcps/update', data)
}

export function deleteMCP(num: string) {
  return post('/admin/mcps/delete', null, { params: { num } })
}

export function enableMCP(num: string) {
  return post('/admin/mcps/enable', null, { params: { num } })
}

export function disableMCP(num: string) {
  return post('/admin/mcps/disable', null, { params: { num } })
}

export function testMCPConnection(num: string) {
  return post<MCPTestResult>('/admin/mcps/test', null, { params: { num } })
}

export interface MCPTestResult {
  success: boolean
  responseTime: number
  errorMessage: string
}
