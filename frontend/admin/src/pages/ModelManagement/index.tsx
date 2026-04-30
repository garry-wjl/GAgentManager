import { useState, useEffect } from 'react'
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select, message,
  Popconfirm, Drawer, Descriptions, Typography, InputNumber, Checkbox, Row, Col, Switch,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { ModelItem, ModelFormValues, ModelProvider, ModelApiType, ModelStatus } from '../../types'
import { getModels, createModel, updateModel, deleteModel, enableModel, disableModel, testModelConnection } from '../../api/model'
import type { TestResult } from '../../api/model'

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

const PROVIDER_OPTIONS = [
  { label: '全部提供商', value: '' },
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
]

const MODEL_STATUS_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '已启用', value: '已启用' },
  { label: '已禁用', value: '已禁用' },
  { label: '异常', value: '异常' },
]

/** 将后端 ModelVO 转换为前端 ModelItem */
function toModelItem(vo: Record<string, unknown>): ModelItem {
  const capabilities = vo.capabilities ? String(vo.capabilities).split(',').filter(Boolean) : []
  return {
    modelId: String(vo.id || ''),
    num: String(vo.num || ''),
    modelName: String(vo.modelName || ''),
    provider: (vo.provider as ModelProvider) || '其他',
    apiType: (vo.apiType as ModelApiType) || 'OpenAI兼容',
    status: (vo.status as ModelStatus) || '已启用',
    capabilities,
    boundAgentCount: Number(vo.boundAgentCount || 0),
    avgResponseTime: undefined,
    totalCalls: 0,
    todayCalls: 0,
    todayTokenCount: 0,
    createTime: String(vo.createTime || ''),
    updater: String(vo.updateNo || ''),
    updateTime: String(vo.updateTime || ''),
  }
}

export default function ModelManagement() {
  const [data, setData] = useState<ModelItem[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [current, setCurrent] = useState<ModelItem | null>(null)
  const [currentVO, setCurrentVO] = useState<Record<string, unknown> | null>(null)
  const [form] = Form.useForm()
  const [testingId, setTestingId] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({ keyword: '', provider: '', status: '' })

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
      if (activeFilters.provider) params.provider = activeFilters.provider
      if (activeFilters.status) params.status = activeFilters.status

      const res = await getModels(params)
      const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
      setData(records.map(toModelItem))
      setPagination(p => ({ ...p, total: Number(res.data.data?.total || 0) }))
    } catch {
      message.error('加载模型列表失败')
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
    setFilters({ keyword: '', provider: '', status: '' })
    setPagination(p => ({ ...p, current: 1 }))
    loadData({ keyword: '', provider: '', status: '' })
  }

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
            onClick={() => handleTest(record)}
          >测试</Button>
          {record.status === '已启用' ? (
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

  const handleTest = async (record: ModelItem) => {
    setTestingId(record.modelId)
    try {
      const res = await testModelConnection(record.num!)
      message.success(res.data.data?.success ? '连通性测试通过' : `测试失败: ${res.data.data?.errorMessage}`)
    } catch {
      message.error('测试失败')
    } finally {
      setTestingId(null)
    }
  }

  const handleEnable = async (record: ModelItem) => {
    try {
      await enableModel(record.num!)
      message.success('启用成功')
      loadData()
    } catch {
      message.error('启用失败')
    }
  }

  const handleDisable = async (record: ModelItem) => {
    try {
      await disableModel(record.num!)
      message.success('禁用成功')
      loadData()
    } catch {
      message.error('禁用失败')
    }
  }

  const handleDelete = async (record: ModelItem) => {
    try {
      await deleteModel(record.num!)
      message.success('删除成功')
      loadData()
    } catch {
      message.error('删除失败')
    }
  }

  const handleSubmit = async (values: ModelFormValues) => {
    try {
      if (current) {
        await updateModel({ ...values, id: current.modelId })
        message.success('修改成功')
      } else {
        await createModel(values)
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
        <Title level={4} style={{ margin: 0 }}>模型管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null); form.resetFields(); setModalOpen(true) }}>
          新增模型
        </Button>
      </div>

      {/* 搜索/筛选栏 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Input.Search
            placeholder="搜索模型名称"
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
            placeholder="提供商筛选"
            value={filters.provider || undefined}
            onChange={(v) => handleFilterChange('provider', v)}
            options={PROVIDER_OPTIONS}
            allowClear
          />
        </Col>
        <Col xs={12} sm={5}>
          <Select
            style={{ width: '100%' }}
            placeholder="状态筛选"
            value={filters.status || undefined}
            onChange={(v) => handleFilterChange('status', v)}
            options={MODEL_STATUS_OPTIONS}
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
        rowKey="modelId"
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
          <Descriptions column={2} bordered>
            <Descriptions.Item label="模型名称">{current.modelName}</Descriptions.Item>
            <Descriptions.Item label="提供商">{current.provider}</Descriptions.Item>
            <Descriptions.Item label="API类型">{current.apiType}</Descriptions.Item>
            <Descriptions.Item label="状态">{current.status}</Descriptions.Item>
            <Descriptions.Item label="能力标签" span={2}>{current.capabilities.map((c) => <Tag key={c}>{c}</Tag>)}</Descriptions.Item>
            <Descriptions.Item label="绑定Agent">{current.boundAgentCount}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{current.updateTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  )
}
