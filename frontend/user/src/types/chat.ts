export interface AttachmentVO {
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
}

export interface FileInfoVO {
  num: string
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  fileType: string
  createTime: string
}

export interface UploadResultVO {
  num: string
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  fileType: string
}

export interface MessageVO {
  num: string
  sessionId: number
  role: string
  content: string
  replyToMessageNum?: string
  thinkingChain?: string
  attachments?: string
  webPreviews?: string
  usedSkills?: string
  usedModel?: string
  tokenUsage?: number
  isError?: boolean
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

export interface SendMessageParams {
  sessionNum: string
  content: string
  replyToMessageNum?: string
  agentId?: number
  attachments?: AttachmentVO[]
}

export interface MarkdownExportVO {
  content: string
}
