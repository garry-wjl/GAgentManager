import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table, Button, Space, Tag, Input, Select, message,
  Popconfirm, Typography, Row, Col,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, RocketOutlined, PauseCircleOutlined, PlayCircleOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { AgentItem, AgentType, AgentStatus } from '../../types'
import { publishAgent, deleteAgent, startAgent, stopAgent, getAgents } from '../../api/agent'

const { Title } = Typography

const AGENT_TYPE_OPTIONS = [
  { label: '全部类型', value: '' },
  { label: '聊天型', value: '聊天型' },
  { label: '工作流型', value: '工作流型' },
  { label: '分析型', value: '分析型' },
  { label: '自动化型', value: '自动化型' },
  { label: '混合型', value: '混合型' },
]

const STATUS_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '未发布', value: '未发布' },
  { label: '已发布', value: '已发布' },
  { label: '已上线', value: '已上线' },
  { label: '已下线', value: '已下线' },
  { label: '异常', value: '异常' },
  { label: '发布中', value: '发布中' },
]

const agentTypeMap: Record<AgentType, string> = {
  '聊天型': 'blue',
  '工作流型': 'green',
  '分析型': 'purple',
  '自动化型': 'orange',
  '混合型': 'cyan',
}

const statusMap: Record<AgentStatus, string> = {
  '未发布': 'default',
  '已发布': 'processing',
  '已上线': 'success',
  '已下线': 'warning',
  '异常': 'error',
  '发布中': 'processing',
}

/** 将后端 AgentVO 转换为前端 AgentItem */
function toAgentItem(vo: Record<string, unknown>): AgentItem {
  const admins = vo.admins ? (vo.admins as string[]) : []
  return {
    agentId: String(vo.id || ''),
    num: String(vo.num || ''),
    agentName: String(vo.agentName || ''),
    agentType: (vo.agentType as AgentType) || '聊天型',
    description: String(vo.description || ''),
    admins,
    status: (vo.status as AgentStatus) || '未发布',
    boundModel: '',
    skillCount: 0,
    mcpCount: 0,
    workflowCount: 0,
    version: String(vo.version || ''),
    creator: String(vo.createNo || ''),
    createTime: String(vo.createTime || ''),
    updater: String(vo.updateNo || ''),
    updateTime: String(vo.updateTime || ''),
  }
}

export default function AgentManagement() {
  const navigate = useNavigate()
  const [data, setData] = useState<AgentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({ keyword: '', status: '', agentType: '' })

  useEffect(() => {
    loadData()
  }, [pagination.current, pagination.pageSize])

  const loadData = async (overrideFilters?: Record<string, string>) => {
    setLoading(true)
    try {
      const activeFilters = overrideFilters ?? filters
      const params: Record<string, unknown> = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      }
      if (activeFilters.keyword) params.keyword = activeFilters.keyword
      if (activeFilters.status) params.status = activeFilters.status
      if (activeFilters.agentType) params.agentType = activeFilters.agentType

      const res = await getAgents(params)
      const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
      setData(records.map(toAgentItem))
      setPagination(p => ({ ...p, total: Number(res.data.data?.total || 0) }))
    } catch {
      message.error('加载Agent列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, keyword: value }
    setFilters(newFilters)
    setPagination(p => ({ ...p, current: 1 }))
    loadData(newFilters)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setPagination(p => ({ ...p, current: 1 }))
    loadData(newFilters)
  }

  const handleReset = () => {
    setFilters({ keyword: '', status: '', agentType: '' })
    setPagination(p => ({ ...p, current: 1 }))
    loadData({ keyword: '', status: '', agentType: '' })
  }

  const columns: ColumnsType<AgentItem> = [
    { title: 'Agent名称', dataIndex: 'agentName', key: 'agentName', width: 150 },
    {
      title: '类型',
      dataIndex: 'agentType',
      key: 'agentType',
      width: 100,
      render: (v: AgentType) => <Tag color={agentTypeMap[v]}>{v}</Tag>,
    },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v: AgentStatus) => <Tag color={statusMap[v]}>{v}</Tag>,
    },
    { title: '版本', dataIndex: 'version', width: 90 },
    { title: '创建时间', dataIndex: 'createTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => navigate(`/agents/${record.num}`)}>详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/agents/${record.num}`)}>编辑</Button>
          {record.status === '未发布' && (
            <Button type="link" size="small" icon={<RocketOutlined />} onClick={() => handlePublish(record)}>发布</Button>
          )}
          {record.status === '已发布' && (
            <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleStart(record)}>上线</Button>
          )}
          {record.status === '已上线' && (
            <Button type="link" size="small" icon={<PauseCircleOutlined />} onClick={() => handleStop(record)}>下线</Button>
          )}
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handlePublish = async (record: AgentItem) => {
    try {
      await publishAgent(record.num!, { version: record.version || 'V1.0.0', changeLog: '' })
      message.success('发布成功')
      loadData()
    } catch {
      message.error('发布失败')
    }
  }

  const handleStart = async (record: AgentItem) => {
    try {
      await startAgent(record.num!)
      message.success('上线成功')
      loadData()
    } catch {
      message.error('上线失败')
    }
  }

  const handleStop = async (record: AgentItem) => {
    try {
      await stopAgent(record.num!)
      message.success('下线成功')
      loadData()
    } catch {
      message.error('下线失败')
    }
  }

  const handleDelete = async (record: AgentItem) => {
    try {
      await deleteAgent(record.num!)
      message.success('删除成功')
      loadData()
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Agent管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/agents/new')}>
          新增Agent
        </Button>
      </div>

      {/* 搜索/筛选栏 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Input.Search
            placeholder="搜索 Agent 名称"
            allowClear
            enterButton={<SearchOutlined />}
            value={filters.keyword}
            onChange={(e) => setFilters(f => ({ ...f, keyword: e.target.value }))}
            onSearch={handleSearch}
          />
        </Col>
        <Col xs={12} sm={5}>
          <Select
            style={{ width: '100%' }}
            placeholder="状态筛选"
            value={filters.status || undefined}
            onChange={(v) => handleFilterChange('status', v)}
            options={STATUS_OPTIONS}
            allowClear
          />
        </Col>
        <Col xs={12} sm={5}>
          <Select
            style={{ width: '100%' }}
            placeholder="类型筛选"
            value={filters.agentType || undefined}
            onChange={(v) => handleFilterChange('agentType', v)}
            options={AGENT_TYPE_OPTIONS}
            allowClear
          />
        </Col>
        <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
          <Button onClick={handleReset}>重置</Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="agentId"
        loading={loading}
        scroll={{ x: 1400 }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (page, size) => { setPagination({ current: page, pageSize: size, total: pagination.total }); loadData() },
        }}
      />
    </div>
  )
}
