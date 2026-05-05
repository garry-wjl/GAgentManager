import { get, post } from './request'
import type { ApiResponse, PageResult } from '../types/api'
import type { SessionVO, CreateSessionParams } from '../types/session'
import type { MessageVO, FileInfoVO, SendMessageParams, MarkdownExportVO } from '../types/chat'
import type { ShareResultVO, ShareContentVO } from '../types/share'

// ==================== Session Query ====================

export function listSessions() {
  return get<ApiResponse<SessionVO[]>>('/chat/query/session/list')
}

export function listSessionsByAgent(agentId: number) {
  return get<ApiResponse<SessionVO[]>>('/chat/query/session/agent-list', { params: { agentId } })
}

export function listSessionsWithPage(pageNo = 1, pageSize = 20) {
  return get<ApiResponse<PageResult<SessionVO>>>('/chat/query/session/list-page', {
    params: { pageNo, pageSize },
  })
}

export function listSessionAttachments(sessionId: number) {
  return get<ApiResponse<FileInfoVO[]>>('/chat/query/session/attachments', { params: { sessionId } })
}

export function exportSessionMarkdown(sessionNum: string) {
  return get<ApiResponse<MarkdownExportVO>>('/chat/query/session/export-markdown', {
    params: { sessionNum },
  })
}

// ==================== Message Query ====================

export function listMessages(sessionId: number, pageNo = 1, pageSize = 50) {
  return get<ApiResponse<PageResult<MessageVO>>>('/chat/query/message/list', {
    params: { sessionId, pageNo, pageSize },
  })
}

// ==================== Session Command ====================

export function createSession(data: CreateSessionParams) {
  return post<ApiResponse<SessionVO>>('/chat/command/session/create', data)
}

export function sendMessage(data: SendMessageParams) {
  return post<ApiResponse<void>>('/chat/command/session/send', data)
}

export function deleteSession(num: string) {
  return post<ApiResponse<void>>('/chat/command/session/delete', null, { params: { num } })
}

export function renameSession(num: string, newTitle: string) {
  return post<ApiResponse<void>>('/chat/command/session/rename', null, { params: { num, newTitle } })
}

// ==================== Share ====================

export function createShare(sessionNum: string) {
  return post<ApiResponse<ShareResultVO>>('/chat/command/share/create', { sessionNum })
}

export function invalidateShare(shareToken: string) {
  return post<ApiResponse<void>>('/chat/command/share/invalidate', { shareToken })
}

export function getShareContent(shareToken: string) {
  return get<ApiResponse<ShareContentVO>>('/chat/query/share/content', { params: { shareToken } })
}

// ==================== SSE Streaming ====================

export async function sendMessageSSE(
  sessionNum: string,
  content: string,
  agentId: number | undefined,
  onChunk: (text: string, isDone: boolean) => void,
): Promise<void> {
  const token = localStorage.getItem('token')
  const response = await fetch('/api/chat/command/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ sessionNum, content, agentId }),
  })

  if (!response.ok) throw new Error('SSE request failed')

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No reader')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      onChunk('', true)
      break
    }
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim()
        if (data === '[DONE]') {
          onChunk('', true)
          return
        }
        if (data) {
          try {
            const parsed = JSON.parse(data)
            onChunk(parsed.chunk || parsed.content || '', parsed.isDone || false)
          } catch {
            onChunk(data, false)
          }
        }
      }
    }
  }
}
