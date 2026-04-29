export interface SessionVO {
  sessionId: string
  sessionTitle: string
  agentId: string
  agentName: string
  messageCount: number
  isActive: boolean
  createTime: string
  updateTime: string
}

export interface CreateSessionParams {
  agentId: string
  sessionTitle?: string
}

export interface UpdateSessionParams {
  sessionTitle: string
}
