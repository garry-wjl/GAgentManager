import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Button, Space, Tag, message, Popconfirm, Form, Input, Select, Descriptions, Card, Checkbox } from 'antd'
import type { DescriptionsProps } from 'antd'
import { EditOutlined, SaveOutlined, DeleteOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { getModel, createModel, updateModel, deleteModel, enableModel, disableModel } from '../../api/model'
import type { ModelItem, ModelFormValues } from '../../types'

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  ENABLED: { text: '已启用', color: 'green' },
  DISABLED: { text: '已禁用', color: 'default' },
  ERROR: { text: '异常', color: 'red' },
}

const CATEGORY_OPTIONS = [
  { label: '文本模型', value: '文本模型' },
  { label: '视觉模型', value: '视觉模型' },
  { label: '语音模型', value: '语音模型' },
  { label: '全模态模型', value: '全模态模型' },
]

const FORM_LAYOUT = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
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

function toModelItem(vo: Record<string, unknown>): ModelItem {
  const capabilities = vo.capabilities ? String(vo.capabilities).split(',').filter(Boolean) : []
  const rawStatus = String(vo.status || 'ENABLED')
  const statusInfo = STATUS_MAP[rawStatus] || STATUS_MAP.ENABLED
  return {
    modelId: String(vo.id || ''),
    num: String(vo.num || ''),
    modelCode: String(vo.modelCode || ''),
    modelName: String(vo.modelName || ''),
    provider: (vo.provider as ModelItem['provider']) || '其他',
    apiType: (vo.apiType as ModelItem['apiType']) || 'OpenAI兼容',
    category: (vo.category as ModelItem['category']) || '文本模型',
    status: statusInfo.text as '已启用' | '已禁用' | '异常',
    _rawStatus: rawStatus,
    capabilities,
    baseUrl: String(vo.baseUrl || ''),
    timeout: Number(vo.timeout || 30),
    retryCount: Number(vo.retryCount || 0),
    maxTokens: Number(vo.maxTokens || 0),
    description: String(vo.description || ''),
    isEnabled: rawStatus === 'ENABLED',
    sortOrder: Number(vo.sortOrder || 0),
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

export default function ModelDetail() {
  const navigate = useNavigate()
  const { num } = useParams<{ num: string }>()
  const location = useLocation()
  const isNew = num === 'new'

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [model, setModel] = useState<ModelItem | null>(null)
  const [editing, setEditing] = useState(false)
  const [form] = Form.useForm()

  const listState = (location.state as { fromList?: boolean; search?: string } | null)
  const listBackUrl = listState?.fromList ? `/models?${listState.search || ''}` : '/models'

  useEffect(() => {
    if (!isNew && num) {
      loadDetail()
    }
  }, [num, isNew])

  useEffect(() => {
    if (editing && model) {
      form.setFieldsValue({
        modelName: model.modelName,
        modelCode: model.modelCode,
        provider: model.provider,
        apiType: model.apiType,
        category: model.category,
        baseUrl: model.baseUrl,
        timeoutSeconds: model.timeout,
        maxRetries: model.retryCount,
        maxTokens: model.maxTokens || undefined,
        capabilities: model.capabilities,
        description: model.description,
        isEnabled: model.isEnabled,
      })
    }
  }, [editing, model])

  const loadDetail = async () => {
    if (!num) return
    setLoading(true)
    try {
      const res = await getModel(num)
      const vo = res.data.data as unknown as Record<string, unknown>
      if (vo) {
        setModel(toModelItem(vo))
      } else {
        message.error('模型不存在')
        navigate('/models')
      }
    } catch {
      message.error('加载模型详情失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (values: Record<string, unknown>) => {
    setSaving(true)
    try {
      const payload = {
        ...values,
        timeout: values.timeoutSeconds,
        retryCount: values.maxRetries,
      }
      if (isNew) {
        await createModel(payload as any)
        message.success('创建成功')
        navigate(listBackUrl)
      } else {
        await updateModel({ ...payload, id: model!.modelId } as any)
        message.success('保存成功')
        setEditing(false)
        loadDetail()
      }
    } catch {
      // 请求失败
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!model?.num) return
    try {
      await deleteModel(model.num)
      message.success('删除成功')
      navigate(listBackUrl)
    } catch {
      message.error('删除失败')
    }
  }

  const handleEnable = async () => {
    if (!model?.num) return
    try {
      await enableModel(model.num)
      message.success('启用成功')
      loadDetail()
    } catch {
      message.error('启用失败')
    }
  }

  const handleDisable = async () => {
    if (!model?.num) return
    try {
      await disableModel(model.num)
      message.success('禁用成功')
      loadDetail()
    } catch {
      message.error('禁用失败')
    }
  }

  const statusInfo = model ? STATUS_MAP[model._rawStatus || ''] || STATUS_MAP.ENABLED : null
  const pageTitle = isNew ? '新增模型' : (editing ? '编辑模型' : '模型详情')

  const extraActions = isNew ? (
    <Space>
      <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>创建</Button>
      <Button onClick={() => navigate(listBackUrl)}>取消</Button>
    </Space>
  ) : editing ? (
    <Space>
      <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>保存</Button>
      <Button onClick={() => setEditing(false)}>取消</Button>
    </Space>
  ) : (
    <Space>
      <Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)}>编辑</Button>
      {model?.status === '已启用' && (
        <Popconfirm title="确定禁用？" onConfirm={handleDisable}>
          <Button icon={<StopOutlined />}>禁用</Button>
        </Popconfirm>
      )}
      {(model?.status === '已禁用' || model?.status === '异常') && (
        <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleEnable}>启用</Button>
      )}
      {model?.status === '已禁用' && (
        <Popconfirm title="确定删除？" onConfirm={handleDelete}>
          <Button danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      )}
    </Space>
  )

  const BaseInfoContent = () => {
    if (!model) return null
    const items: DescriptionsProps['items'] = [
      { key: 'modelName', label: '模型名称', children: model.modelName },
      { key: 'modelCode', label: '模型编码', children: model.modelCode },
      { key: 'provider', label: '提供商', children: model.provider },
      { key: 'apiType', label: 'API类型', children: model.apiType },
      { key: 'category', label: '类型', children: model.category },
      { key: 'baseUrl', label: 'Base URL', children: model.baseUrl || '-' },
      { key: 'status', label: '状态', children: <Tag color={statusInfo?.color}>{statusInfo?.text}</Tag> },
      { key: 'timeout', label: '超时(秒)', children: model.timeout ?? 30 },
      { key: 'retry', label: '重试次数', children: model.retryCount ?? 0 },
      { key: 'maxTokens', label: '最大Token', children: model.maxTokens || '-' },
      { key: 'capabilities', label: '能力标签', children: model.capabilities.length > 0 ? model.capabilities.map((c) => <Tag key={c} style={{ marginInlineEnd: 4 }}>{c}</Tag>) : '-' },
      { key: 'description', label: '描述', children: model.description || '-', span: 2 },
      { key: 'createTime', label: '创建时间', children: model.createTime },
      { key: 'updater', label: '更新人', children: model.updater },
    ]
    return <Descriptions column={2} items={items} size="small" bordered />
  }

  const ModelForm = () => (
    <Card bordered={false}>
      <Form
        {...FORM_LAYOUT}
        form={form}
        onFinish={handleSave}
        style={{ maxWidth: 'none' }}
        initialValues={{ apiType: 'OpenAI兼容', category: '文本模型', timeoutSeconds: 30, maxRetries: 0, isEnabled: true }}
      >
        <Form.Item label="模型名称" name="modelName" rules={[{ required: true, message: '请输入模型名称' }]}>
          <Input placeholder="2-50字符" maxLength={50} />
        </Form.Item>
        {isNew && (
          <Form.Item label="模型编码" name="modelCode" rules={[{ required: true, message: '请输入模型编码' }]}>
            <Input placeholder="MODEL_CODE" maxLength={50} />
          </Form.Item>
        )}
        <Form.Item label="提供商" name="provider" rules={[{ required: true, message: '请选择提供商' }]}>
          <Select
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
        </Form.Item>
        <Form.Item label="API类型" name="apiType" rules={[{ required: true, message: '请选择API类型' }]}>
          <Select
            options={[
              { label: 'OpenAI兼容', value: 'OpenAI兼容' },
              { label: 'Anthropic', value: 'Anthropic' },
              { label: '自定义', value: '自定义' },
            ]}
          />
        </Form.Item>
        <Form.Item label="类型" name="category" rules={[{ required: true, message: '请选择类型' }]}>
          <Select options={CATEGORY_OPTIONS} />
        </Form.Item>
        <Form.Item label="Base URL" name="baseUrl" rules={[{ required: true, message: '请输入Base URL' }]}>
          <Input placeholder="https://api.example.com/v1" />
        </Form.Item>
        {!isNew && (
          <Form.Item label="API Key" name="apiKey">
            <Input.Password placeholder="留空则不修改" />
          </Form.Item>
        )}
        {isNew && (
          <Form.Item label="API Key" name="apiKey" rules={[{ required: true, message: '请输入API Key' }]}>
            <Input.Password placeholder="API密钥（加密存储）" />
          </Form.Item>
        )}
        <Form.Item label="超时(秒)" name="timeoutSeconds">
          <Input type="number" min={1} max={300} />
        </Form.Item>
        <Form.Item label="重试次数" name="maxRetries">
          <Input type="number" min={0} max={10} />
        </Form.Item>
        <Form.Item label="最大Token" name="maxTokens">
          <Input type="number" min={1} max={200000} />
        </Form.Item>
        <Form.Item label="能力标签" name="capabilities">
          <Checkbox.Group options={capabilityOptions} />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea placeholder="可选" rows={3} maxLength={500} showCount />
        </Form.Item>
        <Form.Item hidden name="isEnabled">
          <input type="hidden" />
        </Form.Item>
      </Form>
    </Card>
  )

  return (
    <PageContainer
      header={{
        title: pageTitle,
        subTitle: !isNew && model ? (
          <Tag color={statusInfo?.color} style={{ fontSize: 13 }}>{statusInfo?.text}</Tag>
        ) : null,
        breadcrumb: {
          items: [
            { title: '模型管理', link: listBackUrl },
            { title: isNew ? '新增模型' : model?.modelName || '模型详情' },
          ],
        },
        extra: extraActions,
      }}
      loading={loading}
    >
      {isNew ? (
        <ModelForm />
      ) : editing ? (
        <ModelForm />
      ) : (
        <BaseInfoContent />
      )}
    </PageContainer>
  )
}
