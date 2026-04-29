import { get, post, put, del } from './request'
import type { AgentItem, AgentFormValues, AgentVersionItem, PageResult } from '../types'

export function getAgents(params: Record<string, unknown>) {
  return get<PageResult<AgentItem>>('/agents', { params })
}

export function getAgent(id: string) {
  return get<AgentItem>(`/agents/${id}`)
}

export function createAgent(data: AgentFormValues) {
  return post<AgentItem>('/agents', data)
}

export function updateAgent(id: string, data: AgentFormValues) {
  return put<AgentItem>(`/agents/${id}`, data)
}

export function deleteAgent(id: string) {
  return del(`/agents/${id}`)
}

export function publishAgent(id: string) {
  return post(`/agents/${id}/publish`)
}

export function onlineAgent(id: string) {
  return post(`/agents/${id}/online`)
}

export function offlineAgent(id: string) {
  return post(`/agents/${id}/offline`)
}

export function getAgentVersions(id: string) {
  return get<AgentVersionItem[]>(`/agents/${id}/versions`)
}

export function rollbackAgent(id: string, versionId: string) {
  return post(`/agents/${id}/rollback/${versionId}`)
}

export function getAgentStats() {
  return get<Record<string, unknown>>('/agents/stats')
}
