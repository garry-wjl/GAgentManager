export interface AgentItem {
  agentId: string
  num?: string
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
  userPrompt?: string
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

/** Agent 详情视图对象，对齐后端 AgentVO */
export interface AgentDetailVO {
  id: string
  num: string
  agentCode: string
  agentName: string
  agentType: string
  description: string
  iconUrl: string
  tags: string
  status: string
  version: string
  systemPrompt: string
  userPrompt: string
  temperature: number
  maxTokens: number
  topP: number
  topK: number
  frequencyPenalty: number
  presencePenalty: number
  stopSequences: string
  responseFormat: string
  timeoutSeconds: number
  retryCount: number
  admins: string[]
  createNo: string
  updateNo: string
  createTime: string
  updateTime: string
}

/** Agent 资源绑定视图对象，对齐后端 AgentResourceBindingVO */
export interface AgentResourceBinding {
  id: string
  num: string
  agentId: string
  resourceType: 'MODEL' | 'SKILL' | 'MCP' | 'WORKFLOW'
  resourceId: string
  resourceName: string
  isDefault: boolean
  isEnabled: boolean
  isAvailable: boolean
  sortOrder: number
  config: string
  createTime: string
}

/** 绑定模型参数 */
export interface BindModelParam {
  modelId: string
}

/** 绑定工作流/Skill 参数 */
export interface BindResourceParamV2 {
  resourceId: string
  sortOrder?: number
}

/** 更新资源绑定排序参数 */
export interface UpdateBindingSortParam {
  bindings: BindingSortItem[]
}

export interface BindingSortItem {
  bindingNum: string
  sortOrder: number
}

/** 已启用模型视图对象 */
export interface EnabledModelVO {
  id: string
  num: string
  modelCode: string
  modelName: string
  provider: string
  status: string
}

/** 工作流选项 */
export interface WorkflowOption {
  id: string
  num: string
  workflowName: string
  status: string
  description: string
}

/** Skill 选项 */
export interface SkillOption {
  id: string
  num: string
  skillName: string
  status: string
  description: string
}
