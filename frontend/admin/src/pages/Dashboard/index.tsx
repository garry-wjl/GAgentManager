import { useEffect, useState } from 'react'
import { ProCard, StatisticCard } from '@ant-design/pro-components'
import {
  RobotOutlined,
  UserOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { getDashboard } from '../../api/home'

const { Statistic } = StatisticCard

export default function Dashboard() {
  const [stats, setStats] = useState({
    agentTotal: 0,
    onlineAgents: 0,
    activeUsers: 0,
    modelTotal: 0,
    skillTotal: 0,
    mcpTotal: 0,
    notices: [] as unknown[],
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

  return (
    <ProCard loading={loading} title="系统概览">
      <StatisticCard.Group direction="row">
        <StatisticCard
          statistic={{
            title: 'Agent 总数',
            value: stats.agentTotal,
            icon: <RobotOutlined />,
            valueStyle: { color: '#1677ff' },
          }}
        />
        <StatisticCard
          statistic={{
            title: '在线 Agent',
            value: stats.onlineAgents,
            icon: <CheckCircleOutlined />,
            valueStyle: { color: '#52c41a' },
          }}
        />
        <StatisticCard
          statistic={{
            title: '活跃用户',
            value: stats.activeUsers,
            icon: <UserOutlined />,
            valueStyle: { color: '#722ed1' },
          }}
        />
        <StatisticCard
          statistic={{
            title: '模型总数',
            value: stats.modelTotal,
            icon: <ThunderboltOutlined />,
            valueStyle: { color: '#fa8c16' },
          }}
        />
      </StatisticCard.Group>

      <ProCard title="系统公告" style={{ marginTop: 24 }} loading={loading}>
        {stats.notices.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无公告</div>
        ) : (
          <StatisticCard.Group direction="row">
            {(stats.notices as Array<{ title: string; content: string }>).slice(0, 6).map((n, i) => (
              <StatisticCard key={i} title={n.title} description={n.content} />
            ))}
          </StatisticCard.Group>
        )}
      </ProCard>
    </ProCard>
  )
}
