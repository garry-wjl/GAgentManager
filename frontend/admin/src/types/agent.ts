export interface AgentItem {
  agentId: string
  agentName: string
  agentType: AgentType
  description?: string
  icon?: string
  admins: string[]
  status: AgentStatus
  boundModel: string
  skillCount: number
  mcpCount: number
  workflowCount: number
  version: string
  creator: string
  createTime: string
  updater: string
  updateTime: string
  lastPublishTime?: string
}

export type AgentType = '聊天型' | '工作流型' | '分析型' | '自动化型' | '混合型'
export type AgentStatus = '未发布' | '已发布' | '已上线' | '已下线' | '异常' | '发布中'

export interface AgentVersionItem {
  versionId: string
  agentId: string
  version: string
  versionTag: VersionTag
  changelog?: string
  configSnapshot: Record<string, unknown>
  creator: string
  publishTime?: string
  createTime: string
  isCurrentVersion: boolean
  isStable: boolean
  rollbackFromVersion?: string
  rollbackAvailable: boolean
  rollbackToVersion?: string
}

export type VersionTag = '草稿' | '已发布' | '已上线' | '已下线' | '已回滚' | '已废弃'

export interface AgentFormValues {
  agentName: string
  agentType: AgentType
  description?: string
  admins: string[]
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  topK?: number
  frequencyPenalty?: number
  presencePenalty?: number
  responseFormat?: 'text' | 'json_object' | 'structured_output'
  timeoutSeconds?: number
  retryCount?: number
  boundModel?: string
}
