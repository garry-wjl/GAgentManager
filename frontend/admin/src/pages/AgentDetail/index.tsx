import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Card, Descriptions, Form, Input, Select, Button, Space, Tag, Tabs,
  Table, message, Typography, Row, Col, InputNumber, Divider, Popconfirm, Tooltip,
} from 'antd'
import {
  ArrowLeftOutlined, EditOutlined, SaveOutlined, DeleteOutlined,
  RollbackOutlined, LinkOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getAgentDetail, updateAgent, deleteAgent, getAgentVersions, getAgentBindings, unbindResource, rollbackAgent } from '../../api/agent'
import type { AgentDetailVO, AgentResourceBinding, AgentVersionItem } from '../../types'

const { TextArea } = Input
const { Title, Text } = Typography

const AGENT_TYPE_OPTIONS = [
  { label: '聊天型', value: '聊天型' },
  { label: '工作流型', value: '工作流型' },
  { label: '分析型', value: '分析型' },
  { label: '自动化型', value: '自动化型' },
  { label: '混合型', value: '混合型' },
]

const RESPONSE_FORMAT_OPTIONS = [
  { label: 'Text', value: 'text' },
  { label: 'JSON Object', value: 'json_object' },
  { label: 'Structured Output', value: 'structured_output' },
]

const statusColorMap: Record<string, string> = {
  '未发布': 'default',
  '已发布': 'blue',
  '已上线': 'green',
  '已下线': 'orange',
  '异常': 'red',
  '发布中': 'processing',
}

const tagColorMap: Record<string, string> = {
  '草稿': 'default',
  '已发布': 'blue',
  '已上线': 'green',
  '已下线': 'orange',
  '已回滚': 'purple',
  '已废弃': 'error',
}

/** 将后端 AgentVO 转换为前端 AgentDetailVO */
function toAgentDetailVO(vo: Record<string, unknown>): AgentDetailVO {
  return {
    id: String(vo.id || ''),
    num: String(vo.num || ''),
    agentCode: String(vo.agentCode || ''),
    agentName: String(vo.agentName || ''),
    agentType: String(vo.agentType || ''),
    description: String(vo.description || ''),
    iconUrl: String(vo.iconUrl || ''),
    tags: String(vo.tags || ''),
    status: String(vo.status || ''),
    version: String(vo.version || ''),
    systemPrompt: String(vo.systemPrompt || ''),
    temperature: Number(vo.temperature ?? 1),
    maxTokens: Number(vo.maxTokens ?? 4096),
    topP: Number(vo.topP ?? 1),
    topK: Number(vo.topK ?? 0),
    frequencyPenalty: Number(vo.frequencyPenalty ?? 0),
    presencePenalty: Number(vo.presencePenalty ?? 0),
    stopSequences: String(vo.stopSequences || ''),
    responseFormat: String(vo.responseFormat || ''),
    timeoutSeconds: Number(vo.timeoutSeconds ?? 30),
    retryCount: Number(vo.retryCount ?? 3),
    admins: (vo.admins as string[]) || [],
    createNo: String(vo.createNo || ''),
    updateNo: String(vo.updateNo || ''),
    createTime: String(vo.createTime || ''),
    updateTime: String(vo.updateTime || ''),
  }
}

/** 将后端 AgentVersionVO 转换为前端 AgentVersionItem */
function toAgentVersionItem(vo: Record<string, unknown>): AgentVersionItem {
  return {
    versionId: String(vo.num || ''),
    agentId: String(vo.agentId || ''),
    version: String(vo.version || ''),
    versionTag: (vo.versionTag as AgentVersionItem['versionTag']) || '草稿',
    changelog: String(vo.changelog || ''),
    configSnapshot: (vo.configSnapshot as Record<string, unknown>) || {},
    creator: String(vo.creator || ''),
    publishTime: vo.publishTime ? String(vo.publishTime) : undefined,
    createTime: String(vo.createTime || ''),
    isCurrentVersion: Boolean(vo.isCurrent),
    isStable: Boolean(vo.isStable),
    rollbackFromVersion: vo.rollbackFrom ? String(vo.rollbackFrom) : undefined,
    rollbackAvailable: Boolean(vo.rollbackAvailable),
    rollbackToVersion: vo.rollbackTo ? String(vo.rollbackTo) : undefined,
  }
}

/** 将后端 AgentResourceBindingVO 转换为前端 AgentResourceBinding */
function toAgentResourceBinding(vo: Record<string, unknown>): AgentResourceBinding {
  return {
    id: String(vo.id || ''),
    num: String(vo.num || ''),
    agentId: String(vo.agentId || ''),
    resourceType: (vo.resourceType as AgentResourceBinding['resourceType']) || 'MODEL',
    resourceId: String(vo.resourceId || ''),
    resourceName: String(vo.resourceName || ''),
    isDefault: Boolean(vo.isDefault),
    sortOrder: Number(vo.sortOrder || 0),
    config: String(vo.config || ''),
    createTime: String(vo.createTime || ''),
  }
}

export default function AgentDetail() {
  const navigate = useNavigate()
  const { num } = useParams<{ num: string }>()
  const isNew = num === 'new'

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [detail, setDetail] = useState<AgentDetailVO | null>(null)
  const [editing, setEditing] = useState(false)
  const [form] = Form.useForm()

  // Tab state
  const [versions, setVersions] = useState<AgentVersionItem[]>([])
  const [bindings, setBindings] = useState<AgentResourceBinding[]>([])
  const [versionsLoading, setVersionsLoading] = useState(false)
  const [bindingsLoading, setBindingsLoading] = useState(false)

  useEffect(() => {
    if (!isNew && num) {
      loadDetail()
      loadVersions()
      loadBindings()
    } else if (isNew) {
      setEditing(true)
      form.resetFields()
    }
  }, [num, isNew])

  const loadDetail = async () => {
    if (!num) return
    setLoading(true)
    try {
      const res = await getAgentDetail(num)
      const vo = res.data.data as unknown as Record<string, unknown>
      const data = toAgentDetailVO(vo)
      setDetail(data)
    } catch {
      message.error('加载 Agent 详情失败')
    } finally {
      setLoading(false)
    }
  }

  const loadVersions = async () => {
    if (!detail?.id) return
    setVersionsLoading(true)
    try {
      const res = await getAgentVersions(detail.id)
      const records = (res.data.data as unknown as Record<string, unknown>[]) || []
      setVersions(records.map(toAgentVersionItem))
    } catch {
      // 静默
    } finally {
      setVersionsLoading(false)
    }
  }

  const loadBindings = async () => {
    if (!detail?.id) return
    setBindingsLoading(true)
    try {
      const res = await getAgentBindings(detail.id)
      const records = (res.data.data as unknown as Record<string, unknown>[]) || []
      setBindings(records.map(toAgentResourceBinding))
    } catch {
      // 静默
    } finally {
      setBindingsLoading(false)
    }
  }

  const handleEdit = () => {
    if (!detail) return
    form.setFieldsValue({
      agentName: detail.agentName,
      agentType: detail.agentType,
      description: detail.description,
      systemPrompt: detail.systemPrompt,
      temperature: detail.temperature,
      maxTokens: detail.maxTokens,
      topP: detail.topP,
      topK: detail.topK || undefined,
      frequencyPenalty: detail.frequencyPenalty || undefined,
      presencePenalty: detail.presencePenalty || undefined,
      responseFormat: detail.responseFormat || undefined,
      timeoutSeconds: detail.timeoutSeconds,
      retryCount: detail.retryCount,
      admins: detail.admins.join(','),
    })
    setEditing(true)
  }

  const handleSave = async (values: Record<string, unknown>) => {
    if (!detail) return
    setSaving(true)
    try {
      await updateAgent({
        id: detail.id,
        agentName: String(values.agentName || ''),
        agentType: values.agentType as any,
        description: String(values.description || ''),
        admins: [],
        systemPrompt: String(values.systemPrompt || ''),
        temperature: Number(values.temperature),
        maxTokens: Number(values.maxTokens),
        topP: Number(values.topP),
        topK: values.topK ? Number(values.topK) : undefined,
        frequencyPenalty: values.frequencyPenalty ? Number(values.frequencyPenalty) : undefined,
        presencePenalty: values.presencePenalty ? Number(values.presencePenalty) : undefined,
        responseFormat: values.responseFormat as any,
        timeoutSeconds: values.timeoutSeconds ? Number(values.timeoutSeconds) : undefined,
        retryCount: values.retryCount ? Number(values.retryCount) : undefined,
      })
      message.success('保存成功')
      setEditing(false)
      loadDetail()
    } catch {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    form.resetFields()
  }

  const handleDelete = async () => {
    if (!detail?.num) return
    try {
      await deleteAgent(detail.num)
      message.success('删除成功')
      navigate('/agents')
    } catch {
      message.error('删除失败')
    }
  }

  const handleRollback = async (versionNum: string) => {
    if (!detail?.num) return
    try {
      await rollbackAgent(detail.num, versionNum)
      message.success('回滚成功')
      loadDetail()
      loadVersions()
    } catch {
      message.error('回滚失败')
    }
  }

  const handleUnbind = async (bindingNum: string) => {
    try {
      await unbindResource(bindingNum)
      message.success('解绑成功')
      loadBindings()
    } catch {
      message.error('解绑失败')
    }
  }

  // 页面标题
  const pageTitle = isNew ? '新增 Agent' : (editing ? '编辑 Agent' : 'Agent 详情')

  // 版本历史列
  const versionColumns: ColumnsType<AgentVersionItem> = [
    { title: '版本号', dataIndex: 'version', width: 100, render: (v, r) => r.isCurrentVersion ? <Tag color="blue">{v}</Tag> : v },
    { title: '标签', dataIndex: 'versionTag', width: 100, render: (v) => <Tag color={tagColorMap[v] || 'default'}>{v}</Tag> },
    { title: '变更日志', dataIndex: 'changelog', ellipsis: true },
    { title: '发布人', dataIndex: 'creator', width: 100 },
    { title: '发布时间', dataIndex: 'publishTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, r) => !r.isCurrentVersion && r.rollbackAvailable ? (
        <Popconfirm title="确定回滚到此版本？" onConfirm={() => handleRollback(r.versionId)}>
          <Button type="link" size="small" icon={<RollbackOutlined />}>回滚</Button>
        </Popconfirm>
      ) : null,
    },
  ]

  // 资源绑定列
  const bindingColumns: ColumnsType<AgentResourceBinding> = [
    { title: '资源类型', dataIndex: 'resourceType', width: 100, render: (v) => <Tag>{v}</Tag> },
    { title: '资源名称', dataIndex: 'resourceName' },
    { title: '默认', dataIndex: 'isDefault', width: 80, render: (v) => v ? <Tag color="green">是</Tag> : <Tag>否</Tag> },
    { title: '排序', dataIndex: 'sortOrder', width: 80 },
    { title: '绑定时间', dataIndex: 'createTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, r) => (
        <Popconfirm title="确定解绑？" onConfirm={() => handleUnbind(r.num)}>
          <Button type="link" size="small" danger icon={<LinkOutlined />}>解绑</Button>
        </Popconfirm>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'versions',
      label: '版本历史',
      children: (
        <Table
          columns={versionColumns}
          dataSource={versions}
          rowKey="versionId"
          loading={versionsLoading}
          size="small"
          locale={{ emptyText: '暂无版本记录' }}
          pagination={false}
        />
      ),
    },
    {
      key: 'bindings',
      label: '资源绑定',
      children: (
        <Table
          columns={bindingColumns}
          dataSource={bindings}
          rowKey="num"
          loading={bindingsLoading}
          size="small"
          locale={{ emptyText: '暂无绑定资源' }}
          pagination={false}
        />
      ),
    },
  ]

  return (
    <div>
      {/* 顶部导航栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/agents')}>返回列表</Button>
          <Title level={4} style={{ margin: 0 }}>{pageTitle}</Title>
          {detail && <Tag color={statusColorMap[detail.status] || 'default'}>{detail.status}</Tag>}
          {detail && <Tag>{detail.version}</Tag>}
        </Space>
        {!isNew && (
          <Space>
            {!editing ? (
              <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>编辑</Button>
            ) : (
              <>
                <Button icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>保存</Button>
                <Button onClick={handleCancel}>取消</Button>
              </>
            )}
            <Popconfirm title="确定删除此 Agent？" onConfirm={handleDelete}>
              <Button danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          </Space>
        )}
      </div>

      {/* 基本信息 */}
      <Card loading={loading} style={{ marginBottom: 16 }}>
        {!editing && detail ? (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Agent 名称">{detail.agentName}</Descriptions.Item>
            <Descriptions.Item label="类型"><Tag>{detail.agentType}</Tag></Descriptions.Item>
            <Descriptions.Item label="Agent 编码">{detail.agentCode || '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusColorMap[detail.status] || 'default'}>{detail.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>{detail.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="系统提示词" span={2}>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>{detail.systemPrompt || '-'}</pre>
            </Descriptions.Item>
            <Descriptions.Item label="Temperature">{detail.temperature}</Descriptions.Item>
            <Descriptions.Item label="Max Tokens">{detail.maxTokens}</Descriptions.Item>
            <Descriptions.Item label="Top P">{detail.topP}</Descriptions.Item>
            <Descriptions.Item label="Top K">{detail.topK || '-'}</Descriptions.Item>
            <Descriptions.Item label="Frequency Penalty">{detail.frequencyPenalty || '-'}</Descriptions.Item>
            <Descriptions.Item label="Presence Penalty">{detail.presencePenalty || '-'}</Descriptions.Item>
            <Descriptions.Item label="Response Format">{detail.responseFormat || '-'}</Descriptions.Item>
            <Descriptions.Item label="超时时间(秒)">{detail.timeoutSeconds}</Descriptions.Item>
            <Descriptions.Item label="重试次数">{detail.retryCount}</Descriptions.Item>
            <Descriptions.Item label="Stop Sequences">{detail.stopSequences || '-'}</Descriptions.Item>
            <Descriptions.Item label="管理员" span={2}>{detail.admins.join(', ') || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建人">{detail.createNo}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{detail.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新人">{detail.updateNo}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{detail.updateTime}</Descriptions.Item>
          </Descriptions>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ temperature: 1, maxTokens: 4096, topP: 1, timeoutSeconds: 30, retryCount: 3 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="agentName" label="Agent 名称" rules={[{ required: true, message: '请输入名称' }]}>
                  <Input placeholder="2-50字符" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="agentType" label="类型" rules={[{ required: true, message: '请选择类型' }]}>
                  <Select options={AGENT_TYPE_OPTIONS} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="description" label="描述">
              <TextArea rows={2} maxLength={500} />
            </Form.Item>
            <Form.Item name="systemPrompt" label="系统提示词">
              <TextArea rows={6} maxLength={5000} />
            </Form.Item>
            <Divider orientation="left" style={{ margin: '16px 0' }}>模型参数</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="temperature" label="Temperature">
                  <InputNumber min={0} max={2} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="maxTokens" label="Max Tokens">
                  <InputNumber min={1} max={128000} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="topP" label="Top P">
                  <InputNumber min={0} max={1} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="topK" label="Top K">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="frequencyPenalty" label="Frequency Penalty">
                  <InputNumber min={-2} max={2} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="presencePenalty" label="Presence Penalty">
                  <InputNumber min={-2} max={2} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="responseFormat" label="Response Format">
                  <Select options={RESPONSE_FORMAT_OPTIONS} allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="timeoutSeconds" label="超时时间(秒)">
                  <InputNumber min={5} max={300} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="retryCount" label="重试次数">
                  <InputNumber min={0} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="admins" label="管理员（逗号分隔）">
              <Input placeholder="admin1, admin2" />
            </Form.Item>
          </Form>
        )}
      </Card>

      {/* Tabs */}
      {!isNew && <Tabs items={tabItems} />}
    </div>
  )
}
