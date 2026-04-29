export interface ModelItem {
  modelId: string
  modelName: string
  provider: ModelProvider
  apiType: ModelApiType
  status: ModelStatus
  capabilities: string[]
  boundAgentCount: number
  avgResponseTime?: number
  totalCalls: number
  todayCalls: number
  todayTokenCount: number
  createTime: string
  updater: string
  updateTime: string
}

export type ModelProvider =
  | 'OpenAI'
  | 'Anthropic'
  | 'DeepSeek'
  | '阿里通义'
  | '百度文心'
  | '智谱'
  | 'Google'
  | 'Meta'
  | '本地部署'
  | '其他'

export type ModelApiType = 'OpenAI兼容' | 'Anthropic' | '自定义'
export type ModelStatus = '已启用' | '已禁用' | '异常'

export interface ModelFormValues {
  modelName: string
  provider: ModelProvider
  apiType: ModelApiType
  baseUrl: string
  apiKey: string
  timeoutSeconds?: number
  maxRetries?: number
  maxTokens?: number
  minTemperature?: number
  maxTemperature?: number
  defaultTemperature?: number
  defaultTopP?: number
  defaultTopK?: number
  capabilities: string[]
  inputTypes: string[]
  outputTypes: string[]
  description?: string
  category?: string
  isEnabled: boolean
  sortOrder?: number
}

export interface ModelMonitoring {
  modelId: string
  timestamp: string
  requestCount: number
  successCount: number
  failCount: number
  avgResponseTime: number
  p95ResponseTime: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
  activeAgents: number
}
