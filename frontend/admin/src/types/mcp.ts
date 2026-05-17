export interface MCPItem {
  mcpId: string
  num?: string
  mcpCode?: string
  mcpName: string
  description?: string
  latestVersion?: string
  currentVersion?: string
  isEnabled?: boolean
  status: MCPStatus
  _rawStatus?: string
  boundAgentCount?: number
  serverUrl?: string
  protocolVersion?: string
  transportType?: string
  authType?: string
  timeoutSeconds?: number
  retryEnabled?: boolean
  maxRetries?: number
  healthCheckUrl?: string
  healthCheckInterval?: number
  lastConnectTime?: string
  errorCount?: number
  creator?: string
  createTime: string
  updater?: string
  updateTime: string
}

export type MCPStatus = '已启用' | '已禁用' | '异常'

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

export interface MCPFormValues {
  mcpCode?: string
  mcpName: string
  description?: string
  serverUrl: string
  protocolVersion: string
  transportType: string
  authType: string
  credentials?: string
  timeoutSeconds?: number
  retryEnabled?: boolean
  maxRetries?: number
  healthCheckUrl?: string
  healthCheckInterval?: number
  envVariables?: string
  command?: string
  args?: string
  isEnabled?: boolean
}
