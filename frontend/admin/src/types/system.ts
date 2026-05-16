export interface SystemConfig {
  configKey: string
  configValue: string | Record<string, unknown>
  configType: 'string' | 'number' | 'boolean' | 'json'
  description?: string
  isPublic: boolean
  isModifiable: boolean
  updateTime: string
  updater: string
}

export interface SystemParams {
  maxAgentsPerUser: number
  maxConcurrentAgents: number
  defaultModel: string
  maxUploadFileSize: number
  sessionTimeout: number
  passwordMinLength: number
  passwordRequireUpper: boolean
  passwordRequireLower: boolean
  passwordRequireNumber: boolean
  passwordRequireSpecial: boolean
  passwordExpireDays: number
  maxLoginFailures: number
  lockDuration: number
  enableMfa: boolean
  enableSso: boolean
  dataRetentionDays: number
}
