export interface AttachmentVO {
  fileId: string
  fileName: string
  fileSize: number
  fileType: string
  fileUrl: string
  thumbnailUrl?: string
}

export interface MessageVO {
  messageId: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  thinkingChain?: string
  attachments?: AttachmentVO[]
  createTime: string
}

export interface BubbleListItem {
  key: string
  role: 'user' | 'assistant' | 'system'
  content: string
  thinkingChain?: string
  attachments?: AttachmentVO[]
  createdAt: string
}
