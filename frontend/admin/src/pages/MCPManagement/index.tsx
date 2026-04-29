import { useState } from 'react'
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select, message,
  Popconfirm, Drawer, Descriptions, Tabs, Typography, InputNumber, Row, Col,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined, HistoryOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { MCPItem, MCPStatus, MCPFormValues } from '../../types'

const { TextArea } = Input
const { Title, Text } = Typography

const statusMap: Record<MCPStatus, { text: string; color: string }> = {
  '未连接': { text: '未连接', color: 'default' },
  '连接中': { text: '连接中', color: 'processing' },
  '已连接': { text: '已连接', color: 'green' },
  '异常': { text: '异常', color: 'red' },
}

const mockData: MCPItem[] = [
  {
    mcpId: '1',
    mcpName: 'MySQL服务',
    description: 'MySQL数据库MCP连接服务',
    latestVersion: 'V1.2.0',
    currentVersion: 'V1.2.0',
    isEnabled: true,
    status: '已连接',
    boundAgentCount: 3,
    creator: 'admin',
    createTime: '2026-03-10 10:00:00',
    updater: 'admin',
    updateTime: '2026-04-25 14:00:00',
    lastConnectTime: '2026-04-28 08:00:00',
    errorCount: 0,
  },
  {
    mcpId: '2',
    mcpName: 'Redis缓存',
    description: 'Redis缓存MCP服务',
    latestVersion: 'V1.0.0',
    currentVersion: 'V1.0.0',
    isEnabled: true,
    status: '未连接',
    boundAgentCount: 1,
    creator: 'admin',
    createTime: '2026-04-01 09:00:00',
    updater: 'admin',
    updateTime: '2026-04-20 11:00:00',
    errorCount: 2,
  },
]

export default function MCPManagement() {
  const [data, setData] = useState(mockData)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [current, setCurrent] = useState<MCPItem | null>(null)
  const [form] = Form.useForm()
  const [testingId, setTestingId] = useState<string | null>(null)

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
            onClick={() => { setTestingId(record.mcpId); setTimeout(() => { message.success('连通性测试通过'); setTestingId(null) }, 1500) }}
          >测试</Button>
          {record.isEnabled ? (
            <Popconfirm title="确定禁用？" onConfirm={() => message.success('禁用成功')}>
              <Button type="link" size="small" danger>禁用</Button>
            </Popconfirm>
          ) : (
            <Button type="link" size="small" onClick={() => message.success('启用成功')}>启用</Button>
          )}
          <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleSubmit = async (values: MCPFormValues) => {
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
        <Title level={4} style={{ margin: 0 }}>MCP管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null); form.resetFields(); setModalOpen(true) }}>
          新增MCP
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="mcpId"
        scroll={{ x: 1400 }}
        pagination={{ showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
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
