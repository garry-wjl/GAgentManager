export interface MCPItem {
  mcpId: string
  num?: string
  mcpName: string
  description: string
  feature?: string
  tags?: string
  source: MCPSource
  status: MCPStatus
  _rawStatus?: string
  icon?: string
  configJson?: string
  requestHeaders?: string
  boundAgentCount?: number
  creator?: string
  createTime: string
  updater?: string
  updateTime: string
}

export type MCPSource = 'MCP_GATEWAY' | 'MANUAL'
export type MCPStatus = '草稿' | '已启用' | '已禁用'

export interface MCPToolItem {
  name: string
  description: string
  inputParams: ParamNode[]
  outputParams: ParamNode[]
}

export interface ParamNode {
  fieldName: string
  type: string
  description: string
  children?: ParamNode[]
}

export interface MCPFormValues {
  mcpName: string
  description: string
  feature?: string
  tags?: string
  icon?: string
  source?: string
  status?: string
  configType: 'SSE' | 'STREAMABLE_HTTP'
  configUrl?: string
  headers?: Array<{ key: string; value: string }>
}

export interface MCPVersion {
  versionId: string
  mcpId: string
  version: string
  versionTag: '草稿' | '已发布' | '已禁用' | '已废弃'
  changelog?: string
  configSnapshot: Record<string, unknown>
  creator: string
  publishTime?: string
  createTime: string
  isCurrentVersion: boolean
}
