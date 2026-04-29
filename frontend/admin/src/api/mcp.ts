import { get, post, put, del } from './request'
import type { MCPItem, MCPFormValues, PageResult } from '../types'

export function getMCPs(params?: Record<string, unknown>) {
  return get<PageResult<MCPItem>>('/mcps', { params })
}

export function getMCP(id: string) {
  return get<MCPItem>(`/mcps/${id}`)
}

export function createMCP(data: MCPFormValues) {
  return post<MCPItem>('/mcps', data)
}

export function updateMCP(id: string, data: MCPFormValues) {
  return put<MCPItem>(`/mcps/${id}`, data)
}

export function deleteMCP(id: string) {
  return del(`/mcps/${id}`)
}

export function enableMCP(id: string) {
  return post(`/mcps/${id}/enable`)
}

export function disableMCP(id: string) {
  return post(`/mcps/${id}/disable`)
}

export function testMCPConnection(id: string) {
  return post(`/mcps/${id}/test`)
}
