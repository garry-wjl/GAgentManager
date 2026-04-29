import { useState } from 'react'
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select, message,
  Popconfirm, Drawer, Descriptions, Typography, InputNumber, Checkbox, Row, Col, Switch,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { ModelItem, ModelFormValues, ModelProvider, ModelApiType, ModelStatus } from '../../types'

const { TextArea } = Input
const { Title, Text } = Typography

const statusMap: Record<ModelStatus, { text: string; color: string }> = {
  '已启用': { text: '已启用', color: 'green' },
  '已禁用': { text: '已禁用', color: 'default' },
  '异常': { text: '异常', color: 'red' },
}

const capabilityOptions = [
  { label: '对话', value: '对话' },
  { label: '补全', value: '补全' },
  { label: '函数调用', value: '函数调用' },
  { label: '工具调用', value: '工具调用' },
  { label: '多模态', value: '多模态' },
  { label: 'JSON输出', value: 'JSON输出' },
  { label: 'Structured Output', value: 'Structured Output' },
]

const inputTypeOptions = [
  { label: '文本', value: '文本' },
  { label: '图片', value: '图片' },
  { label: '音频', value: '音频' },
  { label: '视频', value: '视频' },
]

const outputTypeOptions = [
  { label: '文本', value: '文本' },
  { label: 'JSON', value: 'JSON' },
  { label: '图片', value: '图片' },
]

const mockData: ModelItem[] = [
  {
    modelId: '1',
    modelName: 'gpt-4o',
    provider: 'OpenAI',
    apiType: 'OpenAI兼容',
    status: '已启用',
    capabilities: ['对话', '函数调用', '多模态', 'JSON输出'],
    boundAgentCount: 5,
    avgResponseTime: 800,
    totalCalls: 125000,
    todayCalls: 3200,
    todayTokenCount: 8500000,
    createTime: '2026-01-15 10:00:00',
    updater: 'admin',
    updateTime: '2026-04-28 09:00:00',
  },
  {
    modelId: '2',
    modelName: 'qwen-max',
    provider: '阿里通义',
    apiType: 'OpenAI兼容',
    status: '已启用',
    capabilities: ['对话', '函数调用', 'JSON输出'],
    boundAgentCount: 3,
    avgResponseTime: 650,
    totalCalls: 89000,
    todayCalls: 2100,
    todayTokenCount: 5200000,
    createTime: '2026-02-20 14:00:00',
    updater: 'admin',
    updateTime: '2026-04-27 16:00:00',
  },
]

export default function ModelManagement() {
  const [data, setData] = useState(mockData)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [current, setCurrent] = useState<ModelItem | null>(null)
  const [form] = Form.useForm()
  const [testingId, setTestingId] = useState<string | null>(null)

  const columns: ColumnsType<ModelItem> = [
    { title: '模型名称', dataIndex: 'modelName', width: 130 },
    { title: '提供商', dataIndex: 'provider', width: 110 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: ModelStatus) => <Tag color={statusMap[v].color}>{statusMap[v].text}</Tag>,
    },
    { title: '能力标签', dataIndex: 'capabilities', width: 200, render: (v: string[]) => v.map((c) => <Tag key={c}>{c}</Tag>) },
    { title: '绑定Agent', dataIndex: 'boundAgentCount', width: 100 },
    { title: '今日调用', dataIndex: 'todayCalls', width: 100 },
    { title: '今日Token', dataIndex: 'todayTokenCount', width: 120, render: (v: number) => (v / 1000000).toFixed(1) + 'M' },
    { title: '创建时间', dataIndex: 'createTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 260,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => { setCurrent(record); setDetailOpen(true) }}>详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(record); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>
          <Button
            type="link"
            size="small"
            icon={<ThunderboltOutlined />}
            loading={testingId === record.modelId}
            onClick={() => { setTestingId(record.modelId); setTimeout(() => { message.success('连通性测试通过'); setTestingId(null) }, 2000) }}
          >测试</Button>
          {record.status === '已启用' ? (
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

  const handleSubmit = async (values: ModelFormValues) => {
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
        <Title level={4} style={{ margin: 0 }}>模型管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null); form.resetFields(); setModalOpen(true) }}>
          新增模型
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="modelId"
        scroll={{ x: 1400 }}
        pagination={{ showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
      />

      <Modal
        title={current ? '编辑模型' : '新增模型'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        onOk={() => form.submit()}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="modelName" label="模型名称" rules={[{ required: true }]}>
                <Input placeholder="2-50字符" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="provider" label="提供商" rules={[{ required: true }]}>
                <Select options={[
                  { label: 'OpenAI', value: 'OpenAI' },
                  { label: 'Anthropic', value: 'Anthropic' },
                  { label: 'DeepSeek', value: 'DeepSeek' },
                  { label: '阿里通义', value: '阿里通义' },
                  { label: '百度文心', value: '百度文心' },
                  { label: '智谱', value: '智谱' },
                  { label: 'Google', value: 'Google' },
                  { label: 'Meta', value: 'Meta' },
                  { label: '本地部署', value: '本地部署' },
                  { label: '其他', value: '其他' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="apiType" label="API类型" rules={[{ required: true }]}>
                <Select options={[
                  { label: 'OpenAI兼容', value: 'OpenAI兼容' },
                  { label: 'Anthropic', value: 'Anthropic' },
                  { label: '自定义', value: '自定义' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="baseUrl" label="Base URL" rules={[{ required: true }]}>
                <Input placeholder="https://api.example.com/v1" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="apiKey" label="API Key" rules={[{ required: true, message: '请输入API Key' }]}>
                <Input.Password placeholder="API密钥（加密存储）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxTokens" label="最大Token数上限">
                <InputNumber min={1} max={200000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="minTemperature" label="温度下限" initialValue={0}>
                <InputNumber min={0} max={2} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maxTemperature" label="温度上限" initialValue={2}>
                <InputNumber min={0} max={2} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="defaultTemperature" label="默认温度" initialValue={1}>
                <InputNumber min={0} max={2} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="capabilities" label="能力标签">
            <Checkbox.Group options={capabilityOptions} />
          </Form.Item>
          <Form.Item name="inputTypes" label="支持的输入类型">
            <Checkbox.Group options={inputTypeOptions} />
          </Form.Item>
          <Form.Item name="outputTypes" label="支持的输出类型">
            <Checkbox.Group options={outputTypeOptions} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={2} maxLength={500} />
          </Form.Item>
          <Form.Item name="isEnabled" label="启用" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="模型详情"
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        width={720}
      >
        {current && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="模型名称">{current.modelName}</Descriptions.Item>
              <Descriptions.Item label="提供商">{current.provider}</Descriptions.Item>
              <Descriptions.Item label="API类型">{current.apiType}</Descriptions.Item>
              <Descriptions.Item label="状态">{current.status}</Descriptions.Item>
              <Descriptions.Item label="能力标签" span={2}>{current.capabilities.map((c) => <Tag key={c}>{c}</Tag>)}</Descriptions.Item>
              <Descriptions.Item label="绑定Agent">{current.boundAgentCount}</Descriptions.Item>
              <Descriptions.Item label="平均响应">{current.avgResponseTime}ms</Descriptions.Item>
              <Descriptions.Item label="累计调用">{current.totalCalls.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="今日调用">{current.todayCalls.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="今日Token">{(current.todayTokenCount / 1000000).toFixed(1)}M</Descriptions.Item>
              <Descriptions.Item label="更新时间">{current.updateTime}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  )
}
