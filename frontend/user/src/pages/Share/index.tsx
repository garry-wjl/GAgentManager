import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Bubble, ThoughtChain, XProvider } from '@ant-design/x'
import { Spin, Typography, message, Tag } from 'antd'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getShareContent } from '../../api/chat'
import type { ApiResponse } from '../../types/api'
import type { ShareContentVO } from '../../types/share'

const { Title, Text } = Typography

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  )
}

export default function SharePage() {
  const { shareToken } = useParams<{ shareToken: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<ShareContentVO | null>(null)

  useEffect(() => {
    if (!shareToken) return
    loadContent()
  }, [shareToken])

  const loadContent = async () => {
    setLoading(true)
    try {
      const res = await getShareContent(shareToken!) as ApiResponse<ShareContentVO>
      setContent(res.data)
    } catch {
      message.error('分享不存在或已过期')
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="加载分享内容..." />
      </div>
    )
  }

  if (!content) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Title level={3}>分享不存在或已过期</Title>
        <Text>该分享链接可能已失效，请联系分享人重新生成</Text>
      </div>
    )
  }

  return (
    <XProvider>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={3}>{content.sessionTitle}</Title>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 8 }}>
            <Tag color="blue">{content.agentName}</Tag>
            <Tag>{content.shareTime}</Tag>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            GAgentManager · 此页面为只读分享链接
          </Text>
        </div>

        {/* Messages */}
        <Bubble.List
          items={content.messages.map((m) => ({
            key: m.num,
            role: m.role,
            placement: m.role === 'USER' ? 'end' as const : 'start' as const,
            content: (
              <div>
                {m.thinkingChain && (
                  <ThoughtChain style={{ marginBottom: 8 }}>
                    {m.thinkingChain}
                  </ThoughtChain>
                )}
                {m.role === 'USER' ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
                ) : (
                  <MarkdownContent content={m.content} />
                )}
              </div>
            ),
          }))}
        />

        {/* Footer */}
        <div style={{
          marginTop: 32,
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center',
        }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            GAgentManager · 此页面为只读分享链接
          </Text>
        </div>
      </div>
    </XProvider>
  )
}
