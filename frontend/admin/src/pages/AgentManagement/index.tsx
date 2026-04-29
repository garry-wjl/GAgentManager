import { useState } from 'react'
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select, message,
  Popconfirm, Drawer, Descriptions, Tabs, Typography, InputNumber,
  Row, Col, Card,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, RocketOutlined, PauseCircleOutlined, PlayCircleOutlined, HistoryOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { AgentItem, AgentFormValues, AgentType, AgentStatus } from '../../types'
import { publishAgent, deleteAgent, onlineAgent, offlineAgent, getAgents } from '../../api/agent'

const { TextArea } = Input
const { Title } = Typography

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

// Mock data
const mockData: AgentItem[] = [
  {
    agentId: '1',
    agentName: '客服助手',
    agentType: '聊天型',
    description: '用于处理客户咨询的智能客服Agent',
    admins: ['admin'],
    status: '已上线',
    boundModel: 'gpt-4o',
    skillCount: 3,
    mcpCount: 1,
    workflowCount: 0,
    version: 'V1.0.0',
    creator: 'admin',
    createTime: '2026-04-20 10:00:00',
    updater: 'admin',
    updateTime: '2026-04-25 14:30:00',
  },
  {
    agentId: '2',
    agentName: '数据分析助手',
    agentType: '分析型',
    description: '用于数据分析报告生成',
    admins: ['admin', 'dev'],
    status: '已发布',
    boundModel: 'claude-3.5',
    skillCount: 5,
    mcpCount: 2,
    workflowCount: 1,
    version: 'V1.1.0',
    creator: 'dev',
    createTime: '2026-04-18 09:00:00',
    updater: 'dev',
    updateTime: '2026-04-26 11:20:00',
  },
]

export default function AgentManagement() {
  const [data, setData] = useState(mockData)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [current, setCurrent] = useState<AgentItem | null>(null)
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockData.length })

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
    { title: '模型', dataIndex: 'boundModel', width: 120 },
    { title: 'Skill', dataIndex: 'skillCount', width: 70 },
    { title: 'MCP', dataIndex: 'mcpCount', width: 70 },
    { title: '工作流', dataIndex: 'workflowCount', width: 80 },
    { title: '版本', dataIndex: 'version', width: 90 },
    { title: '创建时间', dataIndex: 'createTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => { setCurrent(record); setDetailOpen(true) }}>详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(record); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>
          {record.status === '未发布' && (
            <Button type="link" size="small" icon={<RocketOutlined />} onClick={() => handlePublish(record.agentId)}>发布</Button>
          )}
          {record.status === '已发布' && (
            <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleOnline(record.agentId)}>上线</Button>
          )}
          {record.status === '已上线' && (
            <Button type="link" size="small" icon={<PauseCircleOutlined />} onClick={() => handleOffline(record.agentId)}>下线</Button>
          )}
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.agentId)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handlePublish = async (id: string) => {
    try {
      await publishAgent(id)
      message.success('发布成功')
    } catch {
      message.error('发布失败')
    }
  }

  const handleOnline = async (id: string) => {
    try {
      await onlineAgent(id)
      message.success('上线成功')
    } catch {
      message.error('上线失败')
    }
  }

  const handleOffline = async (id: string) => {
    try {
      await offlineAgent(id)
      message.success('下线成功')
    } catch {
      message.error('下线失败')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAgent(id)
      message.success('删除成功')
    } catch {
      message.error('删除失败')
    }
  }

  const handleSubmit = async (values: AgentFormValues) => {
    try {
      message.success(current ? '修改成功' : '创建成功')
      setModalOpen(false)
      form.resetFields()
      setCurrent(null)
    } catch {
      message.error('操作失败')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Agent管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null); form.resetFields(); setModalOpen(true) }}>
          新增Agent
        </Button>
      </div>

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
          onChange: (page, size) => setPagination({ current: page, pageSize: size, total: pagination.total }),
        }}
      />

      <Modal
        title={current ? '编辑Agent' : '新增Agent'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        onOk={() => form.submit()}
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="agentName" label="Agent名称" rules={[{ required: true }]}>
                <Input placeholder="2-50字符" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="agentType" label="Agent类型" rules={[{ required: true }]}>
                <Select options={[
                  { label: '聊天型', value: '聊天型' },
                  { label: '工作流型', value: '工作流型' },
                  { label: '分析型', value: '分析型' },
                  { label: '自动化型', value: '自动化型' },
                  { label: '混合型', value: '混合型' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <TextArea rows={2} maxLength={500} showCount />
          </Form.Item>
          <Form.Item name="systemPrompt" label="系统提示词">
            <TextArea rows={4} maxLength={5000} showCount />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="temperature" label="Temperature" initialValue={1}>
                <InputNumber min={0} max={2} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maxTokens" label="Max Tokens" initialValue={4096}>
                <InputNumber min={1} max={128000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="topP" label="Top-P" initialValue={1}>
                <InputNumber min={0} max={1} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Drawer
        title="Agent详情"
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        width={720}
      >
        {current && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Agent名称">{current.agentName}</Descriptions.Item>
              <Descriptions.Item label="类型">{current.agentType}</Descriptions.Item>
              <Descriptions.Item label="状态">{current.status}</Descriptions.Item>
              <Descriptions.Item label="版本">{current.version}</Descriptions.Item>
              <Descriptions.Item label="绑定模型">{current.boundModel}</Descriptions.Item>
              <Descriptions.Item label="管理员">{current.admins.join(', ')}</Descriptions.Item>
              <Descriptions.Item label="Skill数">{current.skillCount}</Descriptions.Item>
              <Descriptions.Item label="MCP数">{current.mcpCount}</Descriptions.Item>
              <Descriptions.Item label="创建人">{current.creator}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{current.createTime}</Descriptions.Item>
            </Descriptions>
            <Tabs
              style={{ marginTop: 16 }}
              items={[
                { key: 'skill', label: 'Skill配置', children: <p>Skill绑定管理</p> },
                { key: 'mcp', label: 'MCP配置', children: <p>MCP绑定管理</p> },
                { key: 'workflow', label: '工作流管理', children: <p>工作流集成管理</p> },
                { key: 'version', label: '版本历史', children: <p><HistoryOutlined /> 版本记录</p> },
              ]}
            />
          </>
        )}
      </Drawer>
    </div>
  )
}
