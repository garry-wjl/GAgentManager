export interface ModelItem {
  modelId: string
  num?: string
  modelCode?: string
  modelName: string
  provider: ModelProvider
  apiType: ModelApiType
  category: ModelCategory
  status: ModelStatus
  capabilities: string[]
  connectivityStatus?: string
  _rawStatus?: string
  baseUrl?: string
  timeout?: number
  retryCount?: number
  maxTokens?: number
  description?: string
  isEnabled?: boolean
  sortOrder?: number
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
export type ModelCategory = '文本模型' | '视觉模型' | '语音模型' | '全模态模型'

export interface ModelFormValues {
  modelName: string
  modelCode?: string
  provider: ModelProvider
  apiType: ModelApiType
  category: ModelCategory
  baseUrl: string
  apiKey: string
  timeoutSeconds?: number
  maxRetries?: number
  maxTokens?: number
  capabilities: string[]
  inputTypes: string[]
  outputTypes: string[]
  description?: string
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
