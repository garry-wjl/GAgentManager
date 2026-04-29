import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Bubble, Sender, Conversations, Welcome, ThoughtChain, XProvider,
} from '@ant-design/x'
import {
  PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined,
} from '@ant-design/icons'
import { Input, Modal, message, Dropdown, Spin, Button } from 'antd'
import type { MenuProps } from 'antd'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  getSessions, createSession, updateSession, deleteSession,
  getMessages, sendMessageSSE,
} from '../../api/chat'
import type { SessionVO } from '../../types/session'
import type { AttachmentVO, BubbleListItem } from '../../types/chat'
import type { ApiResponse, PageResult } from '../../types/api'
import type { MessageVO } from '../../types/chat'

// Markdown 渲染组件
function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  )
}

export default function Chat() {
  const [sessions, setSessions] = useState<SessionVO[]>([])
  const [activeSession, setActiveSession] = useState<string | undefined>(undefined)
  const [items, setItems] = useState<BubbleListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  // 加载会话列表
  const loadSessions = async () => {
    try {
      const res = await getSessions() as ApiResponse<SessionVO[]>
      setSessions(res.data)
      if (!activeSession && res.data.length > 0) {
        setActiveSession(res.data[0].sessionId)
        loadMessages(res.data[0].sessionId)
      }
    } catch { /* mock 模式下静默 */ }
  }

  // 加载消息历史
  const loadMessages = async (sessionId: string) => {
    setLoading(true)
    try {
      const res = await getMessages(sessionId) as ApiResponse<PageResult<MessageVO>>
      const list: BubbleListItem[] = res.data.records.map((m) => ({
        key: m.messageId,
        role: m.role,
        content: m.content,
        thinkingChain: m.thinkingChain,
        attachments: m.attachments,
        createdAt: m.createTime,
      }))
      setItems(list)
    } catch { /* mock */ } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadSessions() }, [])

  // 新建会话
  const handleNewSession = async () => {
    try {
      const res = await createSession({ agentId: 'default', sessionTitle: '新会话' }) as ApiResponse<SessionVO>
      const newSession = res.data
      setSessions((prev) => [newSession, ...prev])
      setActiveSession(newSession.sessionId)
      setItems([])
    } catch {
      const mock: SessionVO = {
        sessionId: Date.now().toString(),
        sessionTitle: '新会话',
        agentId: 'default',
        agentName: '默认Agent',
        messageCount: 0,
        isActive: true,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }
      setSessions((prev) => [mock, ...prev])
      setActiveSession(mock.sessionId)
      setItems([])
    }
  }

  // 切换会话
  const handleSelectSession = (sessionId: string) => {
    setActiveSession(sessionId)
    loadMessages(sessionId)
  }

  // 删除会话
  const handleDeleteSession = async (sessionId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后将无法恢复该会话记录',
      onOk: async () => {
        try { await deleteSession(sessionId) } catch { /* mock */ }
        setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId))
        if (activeSession === sessionId) {
          setActiveSession(undefined)
          setItems([])
        }
        message.success('会话已删除')
      },
    })
  }

  // 重命名会话
  const handleRenameSession = (session: SessionVO) => {
    setEditingId(session.sessionId)
    setEditingTitle(session.sessionTitle)
  }

  const handleSaveTitle = async () => {
    if (!editingId) return
    try { await updateSession(editingId, { sessionTitle: editingTitle }) } catch { /* mock */ }
    setSessions((prev) =>
      prev.map((s) =>
        s.sessionId === editingId ? { ...s, sessionTitle: editingTitle } : s,
      ),
    )
    setEditingId(null)
    message.success('重命名成功')
  }

  // 发送消息
  const handleSend = useCallback(async (value: string) => {
    if (!value.trim() || !activeSession || isStreaming) return

    const userMsg: BubbleListItem = {
      key: `user-${Date.now()}`,
      role: 'user',
      content: value,
      createdAt: new Date().toISOString(),
    }
    setItems((prev) => [...prev, userMsg])

    const assistantKey = `assistant-${Date.now()}`
    setItems((prev) => [
      ...prev,
      { key: assistantKey, role: 'assistant', content: '', thinkingChain: '正在思考...', createdAt: new Date().toISOString() },
    ])

    setIsStreaming(true)

    try {
      await sendMessageSSE(activeSession, value, (chunk, isDone) => {
        setItems((prev) =>
          prev.map((item) =>
            item.key === assistantKey
              ? { ...item, content: item.content + chunk, thinkingChain: isDone ? undefined : item.thinkingChain }
              : item,
          ),
        )
        if (isDone) {
          setIsStreaming(false)
        }
      })
    } catch {
      setTimeout(() => {
        setItems((prev) =>
          prev.map((item) =>
            item.key === assistantKey
              ? { ...item, content: `收到您的消息: "${value}"\n\n这是一个模拟回复。`, thinkingChain: undefined }
              : item,
          ),
        )
        setIsStreaming(false)
      }, 1000)
    }
  }, [activeSession, isStreaming])

  // 会话操作菜单
  const sessionMenu = (session: SessionVO): MenuProps['items'] => [
    {
      key: 'rename',
      icon: <EditOutlined />,
      label: '重命名',
      onClick: () => handleRenameSession(session),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      danger: true,
      onClick: () => handleDeleteSession(session.sessionId),
    },
  ]

  const filteredSessions = sessions.filter((s) =>
    s.sessionTitle.toLowerCase().includes(searchValue.toLowerCase()),
  )

  return (
    <XProvider>
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* 左侧会话面板 */}
        <div style={{
          width: 280,
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          background: '#fafafa',
        }}>
          <div style={{ padding: '12px 16px' }}>
            <Button
              type="primary"
              block
              icon={<PlusOutlined />}
              onClick={handleNewSession}
            >
              新对话
            </Button>
          </div>

          <div style={{ padding: '0 16px 12px' }}>
            <Input
              placeholder="搜索会话"
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              size="small"
              allowClear
            />
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            <Conversations
              activeKey={activeSession}
              onActiveChange={handleSelectSession}
              items={filteredSessions.map((s) => ({
                key: s.sessionId,
                label: editingId === s.sessionId ? (
                  <Input
                    size="small"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onPressEnter={handleSaveTitle}
                    onBlur={handleSaveTitle}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : s.sessionTitle,
                description: `${s.messageCount} 条消息`,
                extra: (
                  <Dropdown menu={{ items: sessionMenu(s) }} trigger={['click']} placement="bottomRight">
                    <span
                      onClick={(e) => e.stopPropagation()}
                      style={{ cursor: 'pointer', padding: 4 }}
                    >
                      ⋯
                    </span>
                  </Dropdown>
                ),
              }))}
            />
          </div>
        </div>

        {/* 右侧对话区 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
          {items.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Welcome
                variant="borderless"
                icon="https://mdn.alipayobjects.com/huamei/czg_jc2yfV/afts/img/A*6JjNSO6jIM8AAAAAQFAAAAgALhAAAAAAQAgAgKAEAAAQAAAQ/original"
                title="欢迎使用 GAgentManager"
                description="选择一个已有会话或新建对话开始交流"
              />
            </div>
          ) : (
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
              <Spin spinning={loading}>
                <Bubble.List
                  items={items.map((item) => ({
                    key: item.key,
                    role: item.role,
                    placement: item.role === 'user' ? 'end' : 'start',
                    content: (
                      <div>
                        {item.thinkingChain && (
                          <ThoughtChain style={{ marginBottom: 8 }}>
                            {item.thinkingChain}
                          </ThoughtChain>
                        )}
                        {item.role === 'assistant' ? (
                          <MarkdownContent content={item.content || '...'} />
                        ) : (
                          <div style={{ whiteSpace: 'pre-wrap' }}>{item.content}</div>
                        )}
                        {item.attachments && item.attachments.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            {item.attachments.map((att: AttachmentVO) => (
                              <div
                                key={att.fileId}
                                style={{
                                  padding: '8px 12px',
                                  background: '#f7f8fa',
                                  borderRadius: 8,
                                  marginBottom: 4,
                                  fontSize: 13,
                                }}
                              >
                                📎 {att.fileName} ({(att.fileSize / 1024).toFixed(1)} KB)
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ),
                  }))}
                />
              </Spin>
            </div>
          )}

          {/* 底部输入区 */}
          <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f0f0' }}>
            <Sender
              onSubmit={handleSend}
              placeholder="输入消息... (Shift+Enter 换行)"
              loading={isStreaming}
              autoSize={{ minRows: 1, maxRows: 6 }}
            />
          </div>
        </div>
      </div>
    </XProvider>
  )
}
