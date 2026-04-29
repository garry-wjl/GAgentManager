import { get, post, put, del } from './request'
import type { ApiResponse, PageResult } from '../types/api'
import type { SessionVO, CreateSessionParams, UpdateSessionParams } from '../types/session'
import type { MessageVO } from '../types/chat'

export function getSessions(params?: { agentId?: string }) {
  return get<ApiResponse<SessionVO[]>>('/chat/sessions', { params })
}

export function createSession(data: CreateSessionParams) {
  return post<ApiResponse<SessionVO>>('/chat/sessions', data)
}

export function updateSession(sessionId: string, data: UpdateSessionParams) {
  return put<ApiResponse<void>>(`/chat/sessions/${sessionId}`, data)
}

export function deleteSession(sessionId: string) {
  return del<ApiResponse<void>>(`/chat/sessions/${sessionId}`)
}

export function getMessages(sessionId: string, params?: { current?: number; pageSize?: number }) {
  return get<ApiResponse<PageResult<MessageVO>>>(`/chat/sessions/${sessionId}/messages`, { params })
}

export function sendMessage(sessionId: string, content: string) {
  return post<ApiResponse<MessageVO>>(`/chat/sessions/${sessionId}/messages`, { content })
}

export async function sendMessageSSE(
  sessionId: string,
  content: string,
  onChunk: (text: string, isDone: boolean) => void,
): Promise<void> {
  const token = localStorage.getItem('token')
  const response = await fetch(`/api/chat/sessions/${sessionId}/messages/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ content }),
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
            onChunk(parsed.content || parsed.delta || data, false)
          } catch {
            onChunk(data, false)
          }
        }
      }
    }
  }
}

export function stopGeneration(sessionId: string) {
  return post<ApiResponse<void>>(`/chat/sessions/${sessionId}/stop`)
}
