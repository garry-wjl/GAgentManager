import { get } from './request'
import type { ApiResponse } from '../types/api'
import type { PromptTemplateVO } from '../types/prompt'

export function listPrompts() {
  return get<ApiResponse<PromptTemplateVO[]>>('/api/prompt/list')
}
