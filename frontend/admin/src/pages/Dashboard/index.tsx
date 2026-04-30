import { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Space, Typography } from 'antd'
import {
  RobotOutlined,
  UserOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import type { StatisticProps } from 'antd'
import { getDashboard } from '../../api/home'

const { Title } = Typography

export default function Dashboard() {
  const [stats, setStats] = useState({
    agentTotal: 0,
    onlineAgents: 0,
    activeUsers: 0,
    modelTotal: 0,
    skillTotal: 0,
    mcpTotal: 0,
    notices: [] as any[],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    try {
      const res = await getDashboard()
      setStats(res.data.data as unknown as typeof stats)
    } catch {
      // 静默失败，显示默认值
    } finally {
      setLoading(false)
    }
  }

  const statItems = [
    { title: 'Agent 总数', value: stats.agentTotal, icon: <RobotOutlined />, color: '#1677ff' },
    { title: '在线 Agent', value: stats.onlineAgents, icon: <CheckCircleOutlined />, color: '#52c41a' },
    { title: '活跃用户', value: stats.activeUsers, icon: <UserOutlined />, color: '#722ed1' },
    { title: '模型总数', value: stats.modelTotal, icon: <ThunderboltOutlined />, color: '#fa8c16' },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>系统概览</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statItems.map((s, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card loading={loading}>
              <Statistic
                title={s.title}
                value={s.value}
                prefix={s.icon}
                valueStyle={{ color: s.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={4} style={{ marginBottom: 24 }}>系统公告</Title>
      <Row gutter={[16, 16]}>
        {stats.notices.length === 0 ? (
          <Col span={24}><Card><Typography.Text type="secondary">暂无公告</Typography.Text></Card></Col>
        ) : (
          stats.notices.map((n, i) => (
            <Col xs={24} sm={12} lg={8} key={i}>
              <Card hoverable>
                <Typography.Text strong>{n.title}</Typography.Text>
                <Typography.Paragraph type="secondary" ellipsis style={{ marginBottom: 0, marginTop: 8 }}>
                  {n.content}
                </Typography.Paragraph>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  )
}
