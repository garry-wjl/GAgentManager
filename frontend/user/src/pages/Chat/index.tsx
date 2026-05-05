import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Bubble, Sender, Conversations, Welcome, ThoughtChain, XProvider,
} from '@ant-design/x'
import {
  PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined,
  PaperClipOutlined, RightOutlined, LeftOutlined, ShareAltOutlined,
  DownOutlined, SendOutlined,
} from '@ant-design/icons'
import { Input, Modal, message, Dropdown, Spin, Button, Select, Tag } from 'antd'
import type { MenuProps } from 'antd'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  listSessions, createSession, deleteSession, renameSession,
  listMessages, listSessionAttachments, sendMessageSSE, createShare,
} from '../../api/chat'
import { listAgentsForUser } from '../../api/agent'
import { listPrompts } from '../../api/prompt'
import type { SessionVO } from '../../types/session'
import type { AttachmentVO, BubbleListItem, FileInfoVO, MessageVO } from '../../types/chat'
import type { AgentSimpleVO } from '../../types/agent'
import type { PromptTemplateVO } from '../../types/prompt'
import type { ApiResponse, PageResult } from '../../types/api'
import { useAuth } from '../../hooks/useAuth'

// Markdown 渲染组件
function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  )
}

// 附件卡片组件
function AttachmentCard({ file }: { file: FileInfoVO }) {
  const sizeStr = file.fileSize > 1024 * 1024
    ? `${(file.fileSize / (1024 * 1024)).toFixed(1)} MB`
    : `${(file.fileSize / 1024).toFixed(1)} KB`
  const icon = file.fileType === 'IMAGE' ? '🖼️' : file.fileType === 'PDF' ? '📄' : file.fileType === 'TEXT' ? '📝' : '📎'
  return (
    <div style={{
      padding: '8px 12px',
      background: '#f7f8fa',
      borderRadius: 8,
      marginBottom: 4,
      fontSize: 13,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <span>{icon}</span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {file.fileName}
      </span>
      <span style={{ color: '#999', fontSize: 12 }}>{sizeStr}</span>
    </div>
  )
}

export default function Chat() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<SessionVO[]>([])
  const [activeSession, setActiveSession] = useState<SessionVO | null>(null)
  const [items, setItems] = useState<BubbleListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [editingNum, setEditingNum] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  // Agent
  const [agents, setAgents] = useState<AgentSimpleVO[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<number | undefined>(undefined)

  // File panel
  const [filePanelVisible, setFilePanelVisible] = useState(false)
  const [attachments, setAttachments] = useState<FileInfoVO[]>([])

  // Prompts
  const [prompts, setPrompts] = useState<PromptTemplateVO[]>([])

  // Load agents
  const loadAgents = async () => {
    try {
      const res = await listAgentsForUser() as ApiResponse<AgentSimpleVO[]>
      setAgents(res.data || [])
    } catch { /* silent */ }
  }

  // Load prompts
  const loadPrompts = async () => {
    try {
      const res = await listPrompts() as ApiResponse<PromptTemplateVO[]>
      setPrompts(res.data || [])
    } catch { /* silent */ }
  }

  // Load sessions
  const loadSessions = async () => {
    try {
      const res = await listSessions() as ApiResponse<SessionVO[]>
      setSessions(res.data || [])
      if (!activeSession && res.data && res.data.length > 0) {
        setActiveSession(res.data[0])
        loadMessages(res.data[0])
        loadAttachments(res.data[0])
      }
    } catch { /* silent */ }
  }

  // Load messages
  const loadMessages = async (session: SessionVO) => {
    setLoading(true)
    try {
      const res = await listMessages(session.id, 1, 200) as ApiResponse<PageResult<MessageVO>>
      const list: BubbleListItem[] = (res.data?.records || []).map((m) => ({
        key: m.num,
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
        replyToMessageNum: m.replyToMessageNum,
        thinkingChain: m.thinkingChain,
        createdAt: m.createTime,
      }))
      setItems(list)
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }

  // Load attachments
  const loadAttachments = async (session: SessionVO) => {
    try {
      const res = await listSessionAttachments(session.id) as ApiResponse<FileInfoVO[]>
      setAttachments(res.data || [])
    } catch { /* silent */ }
  }

  useEffect(() => {
    loadSessions()
    loadAgents()
    loadPrompts()
  }, [])

  // New session
  const handleNewSession = async () => {
    try {
      const res = await createSession({
        agentId: selectedAgentId,
        sessionTitle: '新会话',
      }) as ApiResponse<SessionVO>
      const newSession = res.data
      setSessions((prev) => [newSession, ...prev])
      setActiveSession(newSession)
      setItems([])
      setAttachments([])
    } catch {
      message.error('创建会话失败')
    }
  }

  // Select session
  const handleSelectSession = async (num: string) => {
    const session = sessions.find((s) => s.num === num)
    if (!session) return
    setActiveSession(session)
    setSelectedAgentId(session.agentId || undefined)
    setItems([])
    await loadMessages(session)
    await loadAttachments(session)
  }

  // Delete session
  const handleDeleteSession = (num: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后将无法恢复该会话记录',
      onOk: async () => {
        try {
          await deleteSession(num)
        } catch { /* silent */ }
        setSessions((prev) => prev.filter((s) => s.num !== num))
        if (activeSession?.num === num) {
          setActiveSession(null)
          setItems([])
          setAttachments([])
        }
        message.success('会话已删除')
      },
    })
  }

  // Rename session
  const handleRenameSession = (session: SessionVO) => {
    setEditingNum(session.num)
    setEditingTitle(session.sessionTitle)
  }

  const handleSaveTitle = async () => {
    if (!editingNum) return
    try {
      await renameSession(editingNum, editingTitle)
    } catch { /* silent */ }
    setSessions((prev) =>
      prev.map((s) =>
        s.num === editingNum ? { ...s, sessionTitle: editingTitle } : s,
      ),
    )
    if (activeSession?.num === editingNum) {
      setActiveSession({ ...activeSession, sessionTitle: editingTitle })
    }
    setEditingNum(null)
    message.success('重命名成功')
  }

  // Share
  const handleShare = async () => {
    if (!activeSession) return
    try {
      const res = await createShare(activeSession.num) as ApiResponse<{ shareToken: string; shareUrl: string }>
      const url = window.location.origin + res.data.shareUrl
      navigator.clipboard.writeText(url)
      message.success('分享链接已复制到剪贴板')
    } catch {
      message.error('创建分享失败')
    }
  }

  // Send message
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
      await sendMessageSSE(activeSession.num, value, selectedAgentId, (chunk, isDone) => {
        setItems((prev) =>
          prev.map((item) =>
            item.key === assistantKey
              ? { ...item, content: item.content + chunk, thinkingChain: isDone ? undefined : item.thinkingChain }
              : item,
          ),
        )
        if (isDone) {
          setIsStreaming(false)
          // Reload session to update message count
          loadSessions()
        }
      })
    } catch {
      setTimeout(() => {
        setItems((prev) =>
          prev.map((item) =>
            item.key === assistantKey
              ? { ...item, content: `收到您的消息: "${value}"\n\n（AI 服务暂未连接，此为模拟回复）`, thinkingChain: undefined }
              : item,
          ),
        )
        setIsStreaming(false)
      }, 800)
    }
  }, [activeSession, isStreaming, selectedAgentId])

  // Session menu
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
      onClick: () => handleDeleteSession(session.num),
    },
  ]

  const filteredSessions = sessions.filter((s) =>
    s.sessionTitle.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const agentOptions = [
    { value: undefined, label: '🤖 自动' },
    ...agents.map((a) => ({ value: a.id, label: a.agentName })),
  ]

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
            <Button type="primary" block icon={<PlusOutlined />} onClick={handleNewSession}>
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
              activeKey={activeSession?.num}
              onActiveChange={handleSelectSession}
              items={filteredSessions.map((s) => ({
                key: s.num,
                label: editingNum === s.num ? (
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
                    <span onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer', padding: 4 }}>
                      ⋯
                    </span>
                  </Dropdown>
                ),
              }))}
            />
          </div>
          {/* 底部导航 */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
            <a href="/profile" style={{ display: 'block', marginBottom: 8, color: '#1677ff' }}>
              <DownOutlined style={{ marginRight: 6 }} />个人中心
            </a>
          </div>
        </div>

        {/* 中间聊天区 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', minWidth: 0 }}>
          {items.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <Welcome
                variant="borderless"
                icon="https://mdn.alipayobjects.com/huamei/czg_jc2yfV/afts/img/A*6JjNSO6jIM8AAAAAQFAAAAgALhAAAAAAQAgAgKAEAAAQAAAQ/original"
                title="欢迎使用 GAgentManager"
                description="选择一个已有会话或新建对话开始交流"
              />
              {prompts.length > 0 && (
                <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 600 }}>
                  {prompts.map((p) => (
                    <Button
                      key={p.num}
                      size="small"
                      onClick={() => {
                        handleNewSession()
                        // Will fill input - for now just navigate
                      }}
                    >
                      {p.icon} {p.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
              <Spin spinning={loading}>
                <Bubble.List
                  items={items.map((item) => {
                    const isUser = item.role === 'user'
                    return {
                      key: item.key,
                      role: item.role,
                      placement: isUser ? 'end' as const : 'start' as const,
                      content: (
                        <div>
                          {item.replyToMessageNum && (
                            <div style={{
                              padding: '4px 8px',
                              background: '#f0f5ff',
                              borderRadius: 4,
                              marginBottom: 8,
                              fontSize: 12,
                              color: '#666',
                              borderLeft: '3px solid #1677ff',
                            }}>
                              引用: {item.replyToMessageNum}
                            </div>
                          )}
                          {item.thinkingChain && (
                            <ThoughtChain style={{ marginBottom: 8 }}>
                              {item.thinkingChain}
                            </ThoughtChain>
                          )}
                          {!isUser ? (
                            <MarkdownContent content={item.content || '...'} />
                          ) : (
                            <div style={{ whiteSpace: 'pre-wrap' }}>{item.content}</div>
                          )}
                        </div>
                      ),
                    }
                  })}
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

        {/* 右侧文件面板 */}
        {filePanelVisible && (
          <div style={{
            width: 320,
            borderLeft: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            background: '#fafafa',
          }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontWeight: 600 }}>📎 文件列表</span>
              <Button size="small" icon={<LeftOutlined />} onClick={() => setFilePanelVisible(false)}>
                收起
              </Button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              {attachments.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
                  当前会话暂无附件
                </div>
              ) : (
                attachments.map((f) => <AttachmentCard key={f.num} file={f} />)
              )}
            </div>
          </div>
        )}

        {/* 右侧面板切换按钮（当面板收起时显示） */}
        {!filePanelVisible && activeSession && (
          <div style={{
            width: 32,
            borderLeft: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
          }}>
            <Button
              type="text"
              size="small"
              icon={<RightOutlined />}
              onClick={() => setFilePanelVisible(true)}
              title="查看附件"
            />
          </div>
        )}
      </div>
    </XProvider>
  )
}
