import { get, post } from './request'
import type { MCPItem, MCPFormValues, MCPToolItem, PageResult } from '../types'

/** MCP 管理 API，对齐后端接口：
 * Query: /api/mcp/query/*
 * Command: /api/mcp/command/*
 */

export function getMCPs(params?: Record<string, unknown>) {
  return get<PageResult<MCPItem>>('/mcp/query/list', { params })
}

export function getMCPByNum(num: string) {
  return get<MCPItem>('/mcp/query/detail', { params: { num } })
}

export function getMCP(id: string) {
  return get<MCPItem>('/mcp/query/get', { params: { id } })
}

export function getMCPTools(num: string) {
  return get<MCPToolItem[]>('/mcp/query/tools', { params: { num } })
}

export function createMCP(data: MCPFormValues) {
  return post<MCPItem>('/mcp/command/create', data)
}

export function updateMCP(data: MCPFormValues & { num: string }) {
  return post<void>('/mcp/command/update', data)
}

export function deleteMCP(num: string) {
  return post<void>('/mcp/command/delete', null, { params: { num } })
}

export function enableMCP(num: string) {
  return post<void>('/mcp/command/enable', null, { params: { num } })
}

export function disableMCP(num: string) {
  return post<void>('/mcp/command/disable', null, { params: { num } })
}

export function testMCP(num: string) {
  return post<Record<string, unknown>>('/mcp/command/test', null, { params: { num } })
}
