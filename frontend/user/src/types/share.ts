export interface ShareResultVO {
  shareToken: string
  shareUrl: string
  expireTime: string
}

export interface ShareContentVO {
  sessionTitle: string
  agentName: string
  shareTime: string
  messages: ShareMessageVO[]
}

export interface ShareMessageVO {
  num: string
  role: string
  content: string
  thinkingChain?: string
  createTime: string
}
