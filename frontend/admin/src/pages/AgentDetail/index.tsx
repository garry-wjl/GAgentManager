import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Space, Tag, message, Popconfirm } from 'antd'
import { ArrowLeftOutlined, EditOutlined, SaveOutlined, DeleteOutlined, RollbackOutlined, PlusOutlined } from '@ant-design/icons'
import { ProCard, ProForm, ProFormText, ProFormSelect, ProFormDigit, ProFormTextArea, ProDescriptions, ProTable } from '@ant-design/pro-components'
import type { ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { getAgentDetail, updateAgent, deleteAgent, getAgentVersions, getAgentBindings, unbindResource, rollbackAgent, bindModel, getEnabledModels, bindWorkflow, unbindWorkflow, toggleWorkflow, bindSkill, getAgentBindingsByType } from '../../api/agent'
import type { AgentDetailVO, AgentResourceBinding, AgentVersionItem, EnabledModelVO } from '../../types'

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
    userPrompt: String(vo.userPrompt || ''),
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

function toAgentResourceBinding(vo: Record<string, unknown>): AgentResourceBinding {
  return {
    id: String(vo.id || ''),
    num: String(vo.num || ''),
    agentId: String(vo.agentId || ''),
    resourceType: (vo.resourceType as AgentResourceBinding['resourceType']) || 'MODEL',
    resourceId: String(vo.resourceId || ''),
    resourceName: String(vo.resourceName || ''),
    isDefault: Boolean(vo.isDefault),
    isEnabled: Boolean(vo.isEnabled ?? true),
    isAvailable: Boolean(vo.isAvailable ?? true),
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
  const formRef = useRef<ProFormInstance>()

  // Tab state
  const [versions, setVersions] = useState<AgentVersionItem[]>([])
  const [bindings, setBindings] = useState<AgentResourceBinding[]>([])
  const [enabledModels, setEnabledModels] = useState<EnabledModelVO[]>([])

  useEffect(() => {
    if (!isNew && num) {
      loadDetail()
      loadVersions()
      loadBindings()
    } else if (isNew) {
      setEditing(true)
    }
    loadEnabledModels()
  }, [num, isNew])

  const loadDetail = async () => {
    if (!num) return
    setLoading(true)
    try {
      const res = await getAgentDetail(num)
      const vo = res.data.data as unknown as Record<string, unknown>
      setDetail(toAgentDetailVO(vo))
    } catch {
      message.error('加载 Agent 详情失败')
    } finally {
      setLoading(false)
    }
  }

  const loadVersions = async () => {
    if (!detail?.id) return
    try {
      const res = await getAgentVersions(detail.id)
      const records = (res.data.data as unknown as Record<string, unknown>[]) || []
      setVersions(records.map(toAgentVersionItem))
    } catch { /* 静默 */ }
  }

  const loadBindings = async () => {
    if (!detail?.id) return
    try {
      const res = await getAgentBindings(detail.id)
      const records = (res.data.data as unknown as Record<string, unknown>[]) || []
      setBindings(records.map(toAgentResourceBinding))
    } catch { /* 静默 */ }
  }

  const loadEnabledModels = async () => {
    try {
      const res = await getEnabledModels()
      const records = (res.data.data as unknown as Record<string, unknown>[]) || []
      setEnabledModels(records.map((m: Record<string, unknown>) => ({
        id: String(m.id || ''),
        num: String(m.num || ''),
        modelCode: String(m.modelCode || ''),
        modelName: String(m.modelName || ''),
        provider: String(m.provider || ''),
        status: String(m.status || ''),
      })))
    } catch { /* 静默 */ }
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
        userPrompt: String(values.userPrompt || ''),
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
      if (values.boundModelId && detail.num) {
        await bindModel(detail.num, { modelId: String(values.boundModelId) })
      }
      message.success('保存成功')
      setEditing(false)
      loadDetail()
      loadBindings()
    } catch {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
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

  const handleToggleWorkflow = async (bindingNum: string) => {
    try {
      await toggleWorkflow(bindingNum)
      message.success('切换成功')
      loadBindings()
    } catch {
      message.error('切换失败')
    }
  }

  const pageTitle = isNew ? '新增 Agent' : (editing ? '编辑 Agent' : 'Agent 详情')

  const versionColumns: ProColumns<AgentVersionItem>[] = [
    { title: '版本号', dataIndex: 'version', width: 100, render: (_, r) => r.isCurrentVersion ? <Tag color="blue">{r.version}</Tag> : r.version },
    { title: '标签', dataIndex: 'versionTag', width: 100, render: (v) => <Tag color={tagColorMap[v as string] || 'default'}>{v}</Tag> },
    { title: '变更日志', dataIndex: 'changelog', ellipsis: true, search: false },
    { title: '发布人', dataIndex: 'creator', width: 100, search: false },
    { title: '发布时间', dataIndex: 'publishTime', width: 170, search: false },
    {
      title: '操作',
      key: 'action',
      width: 100,
      search: false,
      render: (_, r) => !r.isCurrentVersion && r.rollbackAvailable ? (
        <Popconfirm title="确定回滚到此版本？" onConfirm={() => handleRollback(r.versionId)}>
          <Button type="link" size="small" icon={<RollbackOutlined />}>回滚</Button>
        </Popconfirm>
      ) : null,
    },
  ]

  const bindingColumns: ProColumns<AgentResourceBinding>[] = [
    { title: '资源类型', dataIndex: 'resourceType', width: 100, search: false },
    { title: '资源名称', dataIndex: 'resourceName', search: false },
    { title: '默认', dataIndex: 'isDefault', width: 80, search: false, render: (v) => v ? <Tag color="green">是</Tag> : <Tag>否</Tag> },
    {
      title: '状态',
      dataIndex: 'isAvailable',
      width: 150,
      search: false,
      render: (_, r) => (
        <Space>
          <Tag color={r.isAvailable ? 'green' : 'red'}>{r.isAvailable ? '可用' : '不可用'}</Tag>
          {r.resourceType === 'WORKFLOW' && (
            <Tag color={r.isEnabled ? 'blue' : 'default'}>{r.isEnabled ? '启用' : '停用'}</Tag>
          )}
        </Space>
      ),
    },
    { title: '排序', dataIndex: 'sortOrder', width: 80, search: false },
    { title: '绑定时间', dataIndex: 'createTime', width: 170, search: false },
    {
      title: '操作',
      key: 'action',
      width: 100,
      search: false,
      render: (_, r) => r.resourceType !== 'MODEL' ? (
        <Space>
          {r.resourceType === 'WORKFLOW' && (
            <Button type="link" size="small" onClick={() => handleToggleWorkflow(r.num)}>{r.isEnabled ? '停用' : '启用'}</Button>
          )}
          <Popconfirm title="确定解绑？" onConfirm={() => handleUnbind(r.num)}>
            <Button type="link" size="small" danger>解绑</Button>
          </Popconfirm>
        </Space>
      ) : null,
    },
  ]

  return (
    <div>
      {/* 顶部导航栏 */}
      <ProCard
        style={{ marginBottom: 16 }}
        extra={
          <Space>
            {!isNew && !editing && (
              <Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)}>编辑</Button>
            )}
            {editing && (
              <>
                <Button icon={<SaveOutlined />} loading={saving} onClick={() => formRef.current?.submit()}>保存</Button>
                <Button onClick={() => setEditing(false)}>取消</Button>
              </>
            )}
            {!isNew && (
              <Popconfirm title="确定删除此 Agent？" onConfirm={handleDelete}>
                <Button danger icon={<DeleteOutlined />}>删除</Button>
              </Popconfirm>
            )}
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/agents')}>返回列表</Button>
          </Space>
        }
      >
        <Space>
          <h2 style={{ margin: 0 }}>{pageTitle}</h2>
          {detail && <Tag color={statusColorMap[detail.status] || 'default'}>{detail.status}</Tag>}
          {detail && <Tag>{detail.version}</Tag>}
        </Space>
      </ProCard>

      {/* 基本信息 */}
      {!editing && detail ? (
        <ProDescriptions column={2} loading={loading} title="基本信息">
          <ProDescriptions.Item label="Agent 名称">{detail.agentName}</ProDescriptions.Item>
          <ProDescriptions.Item label="类型"><Tag>{detail.agentType}</Tag></ProDescriptions.Item>
          <ProDescriptions.Item label="Agent 编码">{detail.agentCode || '-'}</ProDescriptions.Item>
          <ProDescriptions.Item label="状态">
            <Tag color={statusColorMap[detail.status] || 'default'}>{detail.status}</Tag>
          </ProDescriptions.Item>
          <ProDescriptions.Item label="描述" span={2}>{detail.description || '-'}</ProDescriptions.Item>
          <ProDescriptions.Item label="系统提示词" span={2}>
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>{detail.systemPrompt || '-'}</pre>
          </ProDescriptions.Item>
          <ProDescriptions.Item label="用户提示词" span={2}>
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>{detail.userPrompt || '-'}</pre>
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Temperature">{detail.temperature}</ProDescriptions.Item>
          <ProDescriptions.Item label="Max Tokens">{detail.maxTokens}</ProDescriptions.Item>
          <ProDescriptions.Item label="Top P">{detail.topP}</ProDescriptions.Item>
          <ProDescriptions.Item label="Top K">{detail.topK || '-'}</ProDescriptions.Item>
          <ProDescriptions.Item label="Frequency Penalty">{detail.frequencyPenalty || '-'}</ProDescriptions.Item>
          <ProDescriptions.Item label="Presence Penalty">{detail.presencePenalty || '-'}</ProDescriptions.Item>
          <ProDescriptions.Item label="Response Format">{detail.responseFormat || '-'}</ProDescriptions.Item>
          <ProDescriptions.Item label="超时时间(秒)">{detail.timeoutSeconds}</ProDescriptions.Item>
          <ProDescriptions.Item label="重试次数">{detail.retryCount}</ProDescriptions.Item>
          <ProDescriptions.Item label="管理员" span={2}>{detail.admins.join(', ') || '-'}</ProDescriptions.Item>
          <ProDescriptions.Item label="创建人">{detail.createNo}</ProDescriptions.Item>
          <ProDescriptions.Item label="创建时间">{detail.createTime}</ProDescriptions.Item>
          <ProDescriptions.Item label="更新人">{detail.updateNo}</ProDescriptions.Item>
          <ProDescriptions.Item label="更新时间">{detail.updateTime}</ProDescriptions.Item>
        </ProDescriptions>
      ) : (
        <ProCard loading={loading} title={isNew ? '新增 Agent' : '编辑 Agent'}>
          <ProForm
            formRef={formRef}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{ temperature: 1, maxTokens: 4096, topP: 1, timeoutSeconds: 30, retryCount: 3 }}
            submitter={false}
          >
            <ProFormText name="agentName" label="Agent 名称" rules={[{ required: true, message: '请输入名称' }]} />
            <ProFormSelect name="agentType" label="类型" rules={[{ required: true, message: '请选择类型' }]} options={AGENT_TYPE_OPTIONS} />
            <ProFormTextArea name="description" label="描述" fieldProps={{ rows: 2, maxLength: 500 }} />
            <ProFormTextArea name="systemPrompt" label="系统提示词" fieldProps={{ rows: 6, maxLength: 5000 }} />
            <ProFormTextArea name="userPrompt" label="用户提示词（预设输入模板）" fieldProps={{ rows: 4, maxLength: 5000, placeholder: '可选，定义用户输入的预设模板格式' }} />

            <ProCard title="模型参数" style={{ marginTop: 16 }}>
              <ProFormDigit name="temperature" label="Temperature" min={0} max={2} fieldProps={{ step: 0.1 }} />
              <ProFormDigit name="maxTokens" label="Max Tokens" min={1} max={128000} />
              <ProFormDigit name="topP" label="Top P" min={0} max={1} fieldProps={{ step: 0.1 }} />
              <ProFormDigit name="topK" label="Top K" min={0} />
              <ProFormDigit name="frequencyPenalty" label="Frequency Penalty" min={-2} max={2} fieldProps={{ step: 0.1 }} />
              <ProFormDigit name="presencePenalty" label="Presence Penalty" min={-2} max={2} fieldProps={{ step: 0.1 }} />
              <ProFormSelect name="responseFormat" label="Response Format" options={RESPONSE_FORMAT_OPTIONS} />
              <ProFormDigit name="timeoutSeconds" label="超时时间(秒)" min={5} max={300} />
              <ProFormDigit name="retryCount" label="重试次数" min={0} max={10} />
            </ProCard>

            <ProFormText name="admins" label="管理员（逗号分隔）" placeholder="admin1, admin2" />

            <ProFormSelect
              name="boundModelId"
              label="绑定模型"
              tooltip="发布前必须绑定一个已启用的模型"
              options={enabledModels.map(m => ({ label: `${m.modelName} (${m.provider})`, value: m.id }))}
              allowClear
            />
          </ProForm>
        </ProCard>
      )}

      {/* Tabs */}
      {!isNew && !editing && (
        <ProCard style={{ marginTop: 16 }} tabs={{ items: [
          {
            key: 'versions',
            label: '版本历史',
            children: (
              <ProTable<AgentVersionItem>
                columns={versionColumns}
                rowKey="versionId"
                dataSource={versions}
                search={false}
                pagination={false}
                options={false}
                locale={{ emptyText: '暂无版本记录' }}
              />
            ),
          },
          {
            key: 'bindings',
            label: '资源绑定',
            children: (
              <ProTable<AgentResourceBinding>
                columns={bindingColumns}
                rowKey="num"
                dataSource={bindings}
                search={false}
                pagination={false}
                options={false}
                locale={{ emptyText: '暂无绑定资源' }}
              />
            ),
          },
        ]}} />
      )}
    </div>
  )
}
