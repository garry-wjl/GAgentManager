export interface MCPItem {
  mcpId: string
  num?: string
  mcpName: string
  description?: string
  latestVersion: string
  currentVersion: string
  isEnabled: boolean
  status: MCPStatus
  boundAgentCount: number
  creator: string
  createTime: string
  updater: string
  updateTime: string
  lastConnectTime?: string
  errorCount: number
}

export type MCPStatus = '未连接' | '连接中' | '已连接' | '异常'

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
  mcpName: string
  description?: string
  serverUrl: string
  protocolVersion: 'v1.0' | 'v1.1' | 'v2.0'
  transportType: 'stdio' | 'sse' | 'http'
  authType: '无认证' | 'API Key' | 'Bearer Token' | 'OAuth2.0' | 'Basic Auth'
  credentials?: Record<string, string>
  timeoutSeconds?: number
  retryEnabled?: boolean
  maxRetries?: number
  healthCheckUrl?: string
  healthCheckInterval?: number
  envVariables?: Record<string, string>
  command?: string
  args?: string[]
}
