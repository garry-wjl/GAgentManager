import { get } from './request'
import type { ApiResponse } from '../types/api'
import type { AgentSimpleVO } from '../types/agent'

export function listAgentsForUser() {
  return get<ApiResponse<AgentSimpleVO[]>>('/api/agent/user/list')
}

export function autoSelectAgent(content: string) {
  return get<ApiResponse<AgentSimpleVO>>('/api/agent/user/auto-select', { params: { content } })
}
