export interface SessionVO {
  id: number
  num: string
  sessionTitle: string
  userId: number
  agentId: number
  messageCount: number
  lastMessageTime: string
  createTime: string
}

export interface CreateSessionParams {
  agentId?: number
  sessionTitle?: string
}

export interface UpdateSessionParams {
  num: string
  newTitle: string
}
