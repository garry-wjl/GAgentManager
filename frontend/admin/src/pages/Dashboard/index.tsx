import { Row, Col, Card, Statistic, Space, Typography } from 'antd'
import {
  RobotOutlined,
  UserOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import type { StatisticProps } from 'antd'

const { Title } = Typography

const mockStats = [
  { title: 'Agent 总数', value: 42, icon: <RobotOutlined />, prefix: '', color: '#1677ff' },
  { title: '在线 Agent', value: 28, icon: <CheckCircleOutlined />, color: '#52c41a' },
  { title: '活跃用户', value: 156, icon: <UserOutlined />, color: '#722ed1' },
  { title: '今日调用', value: 12680, icon: <ThunderboltOutlined />, color: '#fa8c16' },
]

const quickActions = [
  { label: '创建 Agent', desc: '快速创建一个新的AI Agent' },
  { label: '安装 Skill', desc: '从Skill商店安装扩展' },
  { label: '配置 MCP', desc: '添加新的MCP服务' },
  { label: '添加用户', desc: '创建新的平台用户' },
]

export default function Dashboard() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>系统概览</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {mockStats.map((s, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card>
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

      <Title level={4} style={{ marginBottom: 24 }}>快捷操作</Title>
      <Row gutter={[16, 16]}>
        {quickActions.map((a, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card hoverable style={{ textAlign: 'center' }}>
              <Space direction="vertical" size="small">
                <Typography.Text strong>{a.label}</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>{a.desc}</Typography.Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
