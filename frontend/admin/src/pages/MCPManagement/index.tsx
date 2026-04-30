import { useState, useEffect } from 'react'
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select, message,
  Popconfirm, Drawer, Descriptions, Tabs, Typography, InputNumber, Row, Col,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined, HistoryOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { MCPItem, MCPStatus, MCPFormValues } from '../../types'
import { getMCPs, createMCP, updateMCP, deleteMCP, enableMCP, disableMCP, testMCPConnection } from '../../api/mcp'
import type { MCPTestResult } from '../../api/mcp'

const { TextArea } = Input
const { Title, Text } = Typography

const statusMap: Record<MCPStatus, { text: string; color: string }> = {
  '未连接': { text: '未连接', color: 'default' },
  '连接中': { text: '连接中', color: 'processing' },
  '已连接': { text: '已连接', color: 'green' },
  '异常': { text: '异常', color: 'red' },
}

const MCP_STATUS_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '未连接', value: '未连接' },
  { label: '连接中', value: '连接中' },
  { label: '已连接', value: '已连接' },
  { label: '异常', value: '异常' },
]

/** 将后端 McpVO 转换为前端 MCPItem */
function toMCPItem(vo: Record<string, unknown>): MCPItem {
  return {
    mcpId: String(vo.id || ''),
    num: String(vo.num || ''),
    mcpName: String(vo.mcpName || ''),
    description: String(vo.description || ''),
    latestVersion: String(vo.latestVersion || ''),
    currentVersion: String(vo.currentVersion || ''),
    isEnabled: Boolean(vo.isEnabled),
    status: (vo.status as MCPStatus) || '未连接',
    boundAgentCount: Number(vo.boundAgentCount || 0),
    creator: String(vo.creator || ''),
    createTime: String(vo.createTime || ''),
    updater: String(vo.updateNo || ''),
    updateTime: String(vo.updateTime || ''),
    lastConnectTime: vo.lastConnectTime ? String(vo.lastConnectTime) : undefined,
    errorCount: Number(vo.errorCount || 0),
  }
}

export default function MCPManagement() {
  const [data, setData] = useState<MCPItem[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [current, setCurrent] = useState<MCPItem | null>(null)
  const [form] = Form.useForm()
  const [testingId, setTestingId] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({ keyword: '', status: '' })

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

      const res = await getMCPs(params)
      const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
      setData(records.map(toMCPItem))
      setPagination(p => ({ ...p, total: Number(res.data.data?.total || 0) }))
    } catch {
      message.error('加载MCP列表失败')
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
    setFilters({ keyword: '', status: '' })
    setPagination(p => ({ ...p, current: 1 }))
    loadData({ keyword: '', status: '' })
  }

  const columns: ColumnsType<MCPItem> = [
    { title: '服务名称', dataIndex: 'mcpName', width: 130 },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: MCPStatus) => <Tag color={statusMap[v].color}>{statusMap[v].text}</Tag>,
    },
    {
      title: '启用',
      dataIndex: 'isEnabled',
      width: 70,
      render: (v) => v ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>,
    },
    { title: '当前版本', dataIndex: 'currentVersion', width: 100 },
    { title: '绑定Agent', dataIndex: 'boundAgentCount', width: 100 },
    { title: '错误次数', dataIndex: 'errorCount', width: 80 },
    { title: '创建时间', dataIndex: 'createTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 300,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => { setCurrent(record); setDetailOpen(true) }}>详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(record); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>
          <Button
            type="link"
            size="small"
            icon={<ThunderboltOutlined />}
            loading={testingId === record.mcpId}
            onClick={() => handleTest(record)}
          >测试</Button>
          {record.isEnabled ? (
            <Popconfirm title="确定禁用？" onConfirm={() => handleDisable(record)}>
              <Button type="link" size="small" danger>禁用</Button>
            </Popconfirm>
          ) : (
            <Button type="link" size="small" onClick={() => handleEnable(record)}>启用</Button>
          )}
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleTest = async (record: MCPItem) => {
    setTestingId(record.mcpId)
    try {
      const res = await testMCPConnection(record.num!)
      message.success(res.data.data?.success ? '连通性测试通过' : `测试失败: ${res.data.data?.errorMessage}`)
    } catch {
      message.error('测试失败')
    } finally {
      setTestingId(null)
    }
  }

  const handleEnable = async (record: MCPItem) => {
    try {
      await enableMCP(record.num!)
      message.success('启用成功')
      loadData()
    } catch {
      message.error('启用失败')
    }
  }

  const handleDisable = async (record: MCPItem) => {
    try {
      await disableMCP(record.num!)
      message.success('禁用成功')
      loadData()
    } catch {
      message.error('禁用失败')
    }
  }

  const handleDelete = async (record: MCPItem) => {
    try {
      await deleteMCP(record.num!)
      message.success('删除成功')
      loadData()
    } catch {
      message.error('删除失败')
    }
  }

  const handleSubmit = async (values: MCPFormValues) => {
    try {
      if (current) {
        await updateMCP({ ...values, id: current.mcpId })
        message.success('修改成功')
      } else {
        await createMCP(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      setCurrent(null)
      loadData()
    } catch {
      message.error('操作失败')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>MCP管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null); form.resetFields(); setModalOpen(true) }}>
          新增MCP
        </Button>
      </div>

      {/* 搜索/筛选栏 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={10}>
          <Input.Search
            placeholder="搜索 MCP 名称"
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
            options={MCP_STATUS_OPTIONS}
            allowClear
          />
        </Col>
        <Col xs={12} sm={9} style={{ textAlign: 'right' }}>
          <Button onClick={handleReset}>重置</Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="mcpId"
        loading={loading}
        scroll={{ x: 1400 }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (page, size) => { setPagination({ current: page, pageSize: size, total: pagination.total }); loadData() },
        }}
      />

      <Modal
        title={current ? '编辑MCP' : '新增MCP'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        onOk={() => form.submit()}
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="mcpName" label="服务名称" rules={[{ required: true }]}>
                <Input placeholder="2-50字符" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="serverUrl" label="服务器地址" rules={[{ required: true }]}>
                <Input placeholder="http://localhost:8080" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <TextArea rows={2} maxLength={500} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="protocolVersion" label="协议版本" initialValue="v1.0">
                <Select options={[
                  { label: 'v1.0', value: 'v1.0' },
                  { label: 'v1.1', value: 'v1.1' },
                  { label: 'v2.0', value: 'v2.0' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="transportType" label="传输类型" initialValue="sse">
                <Select options={[
                  { label: 'stdio', value: 'stdio' },
                  { label: 'sse', value: 'sse' },
                  { label: 'http', value: 'http' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="authType" label="认证方式" initialValue="无认证">
                <Select options={[
                  { label: '无认证', value: '无认证' },
                  { label: 'API Key', value: 'API Key' },
                  { label: 'Bearer Token', value: 'Bearer Token' },
                  { label: 'OAuth2.0', value: 'OAuth2.0' },
                  { label: 'Basic Auth', value: 'Basic Auth' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="timeoutSeconds" label="超时时间(秒)" initialValue={30}>
                <InputNumber min={5} max={300} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maxRetries" label="最大重试次数" initialValue={3}>
                <InputNumber min={0} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="healthCheckInterval" label="健康检查间隔(秒)" initialValue={60}>
                <InputNumber min={10} max={300} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Drawer
        title="MCP详情"
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        width={720}
      >
        {current && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="服务名称">{current.mcpName}</Descriptions.Item>
              <Descriptions.Item label="状态">{current.status}</Descriptions.Item>
              <Descriptions.Item label="启用">{current.isEnabled ? '是' : '否'}</Descriptions.Item>
              <Descriptions.Item label="当前版本">{current.currentVersion}</Descriptions.Item>
              <Descriptions.Item label="最新版本">{current.latestVersion}</Descriptions.Item>
              <Descriptions.Item label="绑定Agent">{current.boundAgentCount}</Descriptions.Item>
              <Descriptions.Item label="错误次数">{current.errorCount}</Descriptions.Item>
              <Descriptions.Item label="最近连接">{current.lastConnectTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="创建人">{current.creator}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{current.createTime}</Descriptions.Item>
            </Descriptions>
            <Tabs
              style={{ marginTop: 16 }}
              items={[
                { key: 'version', label: '版本历史', children: <p><HistoryOutlined /> MCP版本记录</p> },
                { key: 'config', label: '连接配置', children: <p>MCP连接参数配置</p> },
              ]}
            />
          </>
        )}
      </Drawer>
    </div>
  )
}
