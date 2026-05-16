import { Button, Space, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { ProTable, ModalForm, ProFormText, ProFormSelect, ProFormDigit, ProFormTextArea, ProFormSwitch, ProFormCheckbox } from '@ant-design/pro-components'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import type { ModelItem, ModelFormValues, ModelProvider, ModelApiType } from '../../types'
import { getModels, createModel, updateModel, deleteModel, enableModel, disableModel, testModelConnection } from '../../api/model'
import { useState, useRef } from 'react'

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  ENABLED: { text: '已启用', color: 'green' },
  DISABLED: { text: '已禁用', color: 'default' },
  ERROR: { text: '异常', color: 'red' },
}

const CONNECTIVITY_MAP: Record<string, { text: string; color: string }> = {
  UNTESTED: { text: '未测试', color: 'default' },
  CONNECTED: { text: '已连接', color: 'green' },
  ERROR: { text: '连接失败', color: 'red' },
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

const PROVIDER_OPTIONS: Record<string, { text: string }> = {
  'OpenAI': { text: 'OpenAI' },
  'Anthropic': { text: 'Anthropic' },
  'DeepSeek': { text: 'DeepSeek' },
  '阿里通义': { text: '阿里通义' },
  '百度文心': { text: '百度文心' },
  '智谱': { text: '智谱' },
  'Google': { text: 'Google' },
  'Meta': { text: 'Meta' },
  '本地部署': { text: '本地部署' },
  '其他': { text: '其他' },
}

function toModelItem(vo: Record<string, unknown>): ModelItem {
  const capabilities = vo.capabilities ? String(vo.capabilities).split(',').filter(Boolean) : []
  const rawStatus = String(vo.status || 'ENABLED')
  const statusInfo = STATUS_MAP[rawStatus] || STATUS_MAP.ENABLED
  return {
    modelId: String(vo.id || ''),
    num: String(vo.num || ''),
    modelCode: String(vo.modelCode || ''),
    modelName: String(vo.modelName || ''),
    provider: (vo.provider as ModelProvider) || '其他',
    apiType: (vo.apiType as ModelApiType) || 'OpenAI兼容',
    status: statusInfo.text as '已启用' | '已禁用' | '异常',
    _rawStatus: rawStatus,
    connectivityStatus: String(vo.connectivityStatus || 'UNTESTED'),
    capabilities,
    boundAgentCount: 0,
    avgResponseTime: undefined,
    totalCalls: 0,
    todayCalls: 0,
    todayTokenCount: 0,
    createTime: vo.createTime ? new Date(vo.createTime as number).toLocaleString('zh-CN') : '',
    updater: String(vo.updateNo || ''),
    updateTime: vo.updateTime ? new Date(vo.updateTime as number).toLocaleString('zh-CN') : '',
  }
}

export default function ModelManagement() {
  const actionRef = useRef<ActionType>()
  const [current, setCurrent] = useState<ModelItem | null>(null)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [formVisible, setFormVisible] = useState(false)

  const reload = () => { actionRef.current?.reload() }

  const columns: ProColumns<ModelItem>[] = [
    {
      title: '模型名称',
      dataIndex: 'modelName',
      width: 150,
    },
    {
      title: '模型编码',
      dataIndex: 'modelCode',
      width: 130,
      search: false,
    },
    {
      title: '提供商',
      dataIndex: 'provider',
      width: 110,
      valueEnum: PROVIDER_OPTIONS,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (_, r) => {
        const info = STATUS_MAP[r._rawStatus || ''] || STATUS_MAP.ENABLED
        return <Tag color={info.color}>{info.text}</Tag>
      },
    },
    {
      title: '连通性',
      dataIndex: 'connectivityStatus',
      width: 100,
      search: false,
      render: (_, r) => {
        const info = CONNECTIVITY_MAP[r.connectivityStatus || ''] || CONNECTIVITY_MAP.UNTESTED
        return <Tag color={info.color}>{info.text}</Tag>
      },
    },
    {
      title: '能力标签',
      dataIndex: 'capabilities',
      width: 200,
      search: false,
      render: (_, r) => r.capabilities.map((c) => <Tag key={c}>{c}</Tag>),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 170,
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      search: false,
      render: (_, r) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<ThunderboltOutlined />}
            loading={testingId === r.num}
            onClick={() => handleTest(r)}
          >测试</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(r); setFormVisible(true) }}>编辑</Button>
          {r.status === '已启用' ? (
            <Popconfirm title="确定禁用？" onConfirm={() => handleDisable(r)}>
              <Button type="link" size="small" danger>禁用</Button>
            </Popconfirm>
          ) : (
            <Button type="link" size="small" onClick={() => handleEnable(r)}>启用</Button>
          )}
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleTest = async (record: ModelItem) => {
    setTestingId(record.num!)
    try {
      const res = await testModelConnection(record.num!)
      const result = res.data.data
      if (result?.success) {
        message.success(`连通性测试通过，响应时间: ${result.responseTime}ms`)
      } else {
        message.error(`测试失败: ${result?.errorMessage}`)
      }
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
      reload()
    } catch {
      message.error('启用失败')
    }
  }

  const handleDisable = async (record: ModelItem) => {
    try {
      await disableModel(record.num!)
      message.success('禁用成功')
      reload()
    } catch {
      message.error('禁用失败')
    }
  }

  const handleDelete = async (record: ModelItem) => {
    try {
      await deleteModel(record.num!)
      message.success('删除成功')
      reload()
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <>
      <ProTable<ModelItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="num"
        scroll={{ x: 1400 }}
        request={async (params) => {
          const { modelName, provider, status, current, pageSize } = params
          const apiParams: Record<string, unknown> = {
            pageNo: current ?? 1,
            pageSize: pageSize ?? 10,
          }
          if (modelName) apiParams.keyword = modelName
          if (provider) apiParams.provider = provider
          if (status) {
            // Map Chinese status back to backend enum
            const statusMapReverse: Record<string, string> = { '已启用': 'ENABLED', '已禁用': 'DISABLED', '异常': 'ERROR' }
            apiParams.status = statusMapReverse[String(status)] || status
          }
          const res = await getModels(apiParams)
          const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
          return {
            data: records.map((r) => toModelItem(r)),
            success: true,
            total: Number(res.data.data?.total || 0),
          }
        }}
        headerTitle="模型管理"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null); setFormVisible(true) }}>
            新增模型
          </Button>,
        ]}
        pagination={{
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
        }}
      />

      <ModalForm<ModelFormValues & { modelCode?: string }>
        title={current ? '编辑模型' : '新增模型'}
        open={formVisible}
        onOpenChange={(open) => { if (!open) { setFormVisible(false); setCurrent(null) } }}
        initialValues={{ apiType: 'OpenAI兼容', isEnabled: true }}
        onFinish={async (values) => {
          try {
            const payload = {
              ...values,
              timeout: values.timeoutSeconds,
              retryCount: values.maxRetries,
            }
            if (current) {
              await updateModel({ ...payload, id: current.modelId })
              message.success('修改成功')
            } else {
              // Generate modelCode from modelName if not provided
              const modelCode = values.modelCode || values.modelName.toUpperCase().replace(/\s+/g, '_')
              await createModel({ ...payload, modelCode })
              message.success('创建成功')
            }
            setFormVisible(false)
            setCurrent(null)
            reload()
            return true
          } catch {
            message.error('操作失败')
            return false
          }
        }}
        width={800}
      >
        <ProFormText name="modelName" label="模型名称" rules={[{ required: true }]} placeholder="2-50字符" />
        {!current && (
          <ProFormText name="modelCode" label="模型编码" rules={[{ required: true, message: '请输入模型编码' }]} placeholder="MODEL_CODE" />
        )}
        <ProFormSelect
          name="provider"
          label="提供商"
          rules={[{ required: true }]}
          options={[
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
          ]}
        />
        <ProFormSelect
          name="apiType"
          label="API类型"
          rules={[{ required: true }]}
          options={[
            { label: 'OpenAI兼容', value: 'OpenAI兼容' },
            { label: 'Anthropic', value: 'Anthropic' },
            { label: '自定义', value: '自定义' },
          ]}
        />
        <ProFormText name="baseUrl" label="Base URL" rules={[{ required: true }]} placeholder="https://api.example.com/v1" />
        <ProFormText.Password name="apiKey" label="API Key" rules={[{ required: true, message: '请输入API Key' }]} placeholder="API密钥（加密存储）" />
        <ProFormDigit name="timeoutSeconds" label="超时时间(秒)" min={1} max={300} />
        <ProFormDigit name="maxRetries" label="最大重试次数" min={0} max={10} />
        <ProFormDigit name="maxTokens" label="最大Token数上限" min={1} max={200000} />
        <ProFormCheckbox.Group name="capabilities" label="能力标签" options={capabilityOptions} />
        <ProFormCheckbox.Group name="inputTypes" label="支持的输入类型" options={inputTypeOptions} />
        <ProFormCheckbox.Group name="outputTypes" label="支持的输出类型" options={outputTypeOptions} />
        <ProFormTextArea name="description" label="描述" />
        <ProFormSwitch name="isEnabled" label="启用" />
      </ModalForm>
    </>
  )
}
