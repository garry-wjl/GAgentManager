import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Button, Space, Tag, message, Popconfirm, Form, Input, Select, Descriptions, Card, Radio } from 'antd'
import type { DescriptionsProps } from 'antd'
import { EditOutlined, SaveOutlined, DeleteOutlined, StopOutlined, PlayCircleOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { getMCP, getMCPByNum, createMCP, updateMCP, deleteMCP, enableMCP, disableMCP, testMCP } from '../../api/mcp'
import type { MCPItem, MCPFormValues } from '../../types'

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  UNCONNECTED: { text: '未连接', color: 'default' },
  CONNECTED: { text: '已连接', color: 'green' },
  ERROR: { text: '异常', color: 'red' },
}

const FORM_LAYOUT = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
}

function toMCPItem(vo: Record<string, unknown>): MCPItem {
  const rawStatus = String(vo.status || 'UNCONNECTED')
  const statusInfo = STATUS_MAP[rawStatus] || STATUS_MAP.UNCONNECTED
  return {
    mcpId: String(vo.id || ''),
    num: String(vo.num || ''),
    mcpCode: String(vo.mcpCode || ''),
    mcpName: String(vo.mcpName || ''),
    description: String(vo.description || ''),
    status: statusInfo.text as '已启用' | '已禁用' | '异常',
    _rawStatus: rawStatus,
    isEnabled: Boolean(vo.isEnabled),
    serverUrl: String(vo.serverUrl || ''),
    protocolVersion: String(vo.protocolVersion || ''),
    transportType: String(vo.transportType || ''),
    authType: String(vo.authType || ''),
    timeoutSeconds: Number(vo.timeoutSeconds || 30),
    retryEnabled: Boolean(vo.retryEnabled),
    maxRetries: Number(vo.maxRetries || 0),
    healthCheckUrl: String(vo.healthCheckUrl || ''),
    healthCheckInterval: Number(vo.healthCheckInterval || 0),
    boundAgentCount: Number(vo.boundAgentCount || 0),
    creator: String(vo.creator || ''),
    createTime: vo.createTime ? new Date(vo.createTime as number).toLocaleString('zh-CN') : '',
    updater: String(vo.updateNo || ''),
    updateTime: vo.updateTime ? new Date(vo.updateTime as number).toLocaleString('zh-CN') : '',
  }
}

export default function MCPDetail() {
  const navigate = useNavigate()
  const { num } = useParams<{ num: string }>()
  const location = useLocation()
  const isNew = num === 'new'

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mcp, setMcp] = useState<MCPItem | null>(null)
  const [editing, setEditing] = useState(false)
  const [form] = Form.useForm()

  const listState = (location.state as { fromList?: boolean; search?: string } | null)
  const listBackUrl = listState?.fromList ? `/mcps?${listState.search || ''}` : '/mcps'

  useEffect(() => {
    if (!isNew && num) {
      loadDetail()
    }
  }, [num, isNew])

  useEffect(() => {
    if (editing && mcp) {
      form.setFieldsValue({
        mcpName: mcp.mcpName,
        description: mcp.description,
        serverUrl: mcp.serverUrl,
        protocolVersion: mcp.protocolVersion,
        transportType: mcp.transportType,
        authType: mcp.authType,
        timeoutSeconds: mcp.timeoutSeconds,
        retryEnabled: mcp.retryEnabled,
        maxRetries: mcp.maxRetries,
        healthCheckUrl: mcp.healthCheckUrl,
        healthCheckInterval: mcp.healthCheckInterval,
      })
    }
  }, [editing, mcp])

  const loadDetail = async () => {
    if (!num) return
    setLoading(true)
    try {
      const res = await getMCPByNum(num)
      const vo = res.data.data as unknown as Record<string, unknown>
      if (vo) {
        setMcp(toMCPItem(vo))
      } else {
        message.error('MCP服务不存在')
        navigate('/mcps')
      }
    } catch {
      message.error('加载MCP详情失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (values: Record<string, unknown>) => {
    setSaving(true)
    try {
      if (isNew) {
        await createMCP(values as unknown as MCPFormValues)
        message.success('创建成功')
        navigate(listBackUrl)
      } else {
        await updateMCP({ ...values, id: mcp!.mcpId } as any)
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
    if (!mcp?.num) return
    try {
      await deleteMCP(mcp.num)
      message.success('删除成功')
      navigate(listBackUrl)
    } catch {
      message.error('删除失败')
    }
  }

  const handleEnable = async () => {
    if (!mcp?.num) return
    try {
      await enableMCP(mcp.num)
      message.success('启用成功')
      loadDetail()
    } catch {
      message.error('启用失败')
    }
  }

  const handleDisable = async () => {
    if (!mcp?.num) return
    try {
      await disableMCP(mcp.num)
      message.success('禁用成功')
      loadDetail()
    } catch {
      message.error('禁用失败')
    }
  }

  const handleTest = async () => {
    if (!mcp?.num) return
    try {
      const res = await testMCP(mcp.num)
      const result = res.data.data
      if (result?.success) {
        const latency = result.connectLatencyMs ? `${result.connectLatencyMs}ms` : ''
        message.success(`连通性测试通过${latency ? `，延迟 ${latency}` : ''}`)
      } else {
        message.error(`连通性测试失败：${result?.errorMessage || '未知错误'}`)
      }
      loadDetail()
    } catch {
      message.error('连通性测试失败')
      loadDetail()
    }
  }

  const statusInfo = mcp ? STATUS_MAP[mcp._rawStatus || ''] || STATUS_MAP.UNCONNECTED : null
  const pageTitle = isNew ? '新增MCP' : (editing ? '编辑MCP' : 'MCP详情')

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
      <Button icon={<ThunderboltOutlined />} onClick={handleTest}>测试连接</Button>
      {mcp?.isEnabled && (
        <Popconfirm title="确定禁用？" onConfirm={handleDisable}>
          <Button icon={<StopOutlined />}>禁用</Button>
        </Popconfirm>
      )}
      {mcp?.isEnabled === false && (
        <>
          <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleEnable}>启用</Button>
          <Popconfirm title="确定删除？" onConfirm={handleDelete}>
            <Button danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </>
      )}
    </Space>
  )

  const BaseInfoContent = () => {
    if (!mcp) return null
    const items: DescriptionsProps['items'] = [
      { key: 'mcpName', label: '服务名称', children: mcp.mcpName },
      { key: 'mcpCode', label: '服务编码', children: mcp.mcpCode },
      { key: 'status', label: '连接状态', children: <Tag color={statusInfo?.color}>{statusInfo?.text}</Tag> },
      { key: 'isEnabled', label: '启用状态', children: mcp.isEnabled ? <Tag color="green">已启用</Tag> : <Tag color="default">已禁用</Tag> },
      { key: 'serverUrl', label: '服务器地址', children: mcp.serverUrl || '-' },
      { key: 'protocolVersion', label: '协议版本', children: mcp.protocolVersion || '-' },
      { key: 'transportType', label: '传输类型', children: mcp.transportType || '-' },
      { key: 'authType', label: '认证方式', children: mcp.authType || '-' },
      { key: 'timeoutSeconds', label: '超时时间(秒)', children: mcp.timeoutSeconds ?? 30 },
      { key: 'retryEnabled', label: '重试开关', children: mcp.retryEnabled ? '开启' : '关闭' },
      { key: 'maxRetries', label: '最大重试次数', children: mcp.maxRetries ?? 0 },
      { key: 'healthCheckUrl', label: '健康检查地址', children: mcp.healthCheckUrl || '-' },
      { key: 'healthCheckInterval', label: '健康检查间隔(秒)', children: mcp.healthCheckInterval || '-' },
      { key: 'boundAgentCount', label: '绑定Agent数', children: mcp.boundAgentCount ?? 0 },
      { key: 'description', label: '描述', children: mcp.description || '-', span: 2 },
      { key: 'createTime', label: '创建时间', children: mcp.createTime },
      { key: 'creator', label: '创建人', children: mcp.creator },
      { key: 'updater', label: '更新人', children: mcp.updater },
    ]
    return <Descriptions column={2} items={items} size="small" bordered />
  }

  const MCPForm = () => (
    <Card bordered={false}>
      <Form
        {...FORM_LAYOUT}
        form={form}
        onFinish={handleSave}
        style={{ maxWidth: 'none' }}
        initialValues={{ transportType: 'SSE', protocolVersion: '2024-11-05', timeoutSeconds: 30, retryEnabled: false, maxRetries: 0 }}
      >
        <Form.Item label="服务名称" name="mcpName" rules={[{ required: true, message: '请输入服务名称' }]}>
          <Input placeholder="2-50字符" maxLength={50} />
        </Form.Item>
        {isNew && (
          <Form.Item label="服务编码" name="mcpCode" rules={[{ required: true, message: '请输入服务编码' }]}>
            <Input placeholder="MCP_CODE" maxLength={50} />
          </Form.Item>
        )}
        <Form.Item label="描述" name="description">
          <Input.TextArea placeholder="可选" rows={3} maxLength={500} showCount />
        </Form.Item>
        <Form.Item label="服务器地址" name="serverUrl" rules={[{ required: true, message: '请输入服务器地址' }]}>
          <Input placeholder="https://mcp.example.com/mcp" />
        </Form.Item>
        <Form.Item label="协议版本" name="protocolVersion" rules={[{ required: true, message: '请选择协议版本' }]}>
          <Input placeholder="如 2024-11-05" />
        </Form.Item>
        <Form.Item label="传输类型" name="transportType" rules={[{ required: true, message: '请选择传输类型' }]}>
          <Radio.Group>
            <Radio value="SSE">SSE</Radio>
            <Radio value="HTTP">HTTP</Radio>
            <Radio value="STDIO">STDIO</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="认证方式" name="authType">
          <Radio.Group>
            <Radio value="NONE">无</Radio>
            <Radio value="BEARER_TOKEN">Bearer Token</Radio>
            <Radio value="API_KEY">API Key</Radio>
          </Radio.Group>
        </Form.Item>
        {isNew && (
          <Form.Item label="认证凭据" name="credentials">
            <Input.Password placeholder="认证密钥/Token（加密存储）" />
          </Form.Item>
        )}
        {!isNew && (
          <Form.Item label="认证凭据" name="credentials">
            <Input.Password placeholder="留空则不修改" />
          </Form.Item>
        )}
        <Form.Item label="超时时间(秒)" name="timeoutSeconds">
          <Input type="number" min={1} max={300} />
        </Form.Item>
        <Form.Item label="重试开关" name="retryEnabled" valuePropName="checked">
          <Radio.Group>
            <Radio value={true}>开启</Radio>
            <Radio value={false}>关闭</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="最大重试次数" name="maxRetries">
          <Input type="number" min={0} max={10} />
        </Form.Item>
        <Form.Item label="健康检查地址" name="healthCheckUrl">
          <Input placeholder="https://mcp.example.com/health" />
        </Form.Item>
        <Form.Item label="健康检查间隔(秒)" name="healthCheckInterval">
          <Input type="number" min={10} max={3600} />
        </Form.Item>
      </Form>
    </Card>
  )

  return (
    <PageContainer
      header={{
        title: pageTitle,
        subTitle: !isNew && mcp ? (
          <Tag color={statusInfo?.color} style={{ fontSize: 13 }}>{statusInfo?.text}</Tag>
        ) : null,
        breadcrumb: {
          items: [
            { title: 'MCP管理', link: listBackUrl },
            { title: isNew ? '新增MCP' : mcp?.mcpName || 'MCP详情' },
          ],
        },
        extra: extraActions,
      }}
      loading={loading}
    >
      {isNew ? (
        <MCPForm />
      ) : editing ? (
        <MCPForm />
      ) : (
        <BaseInfoContent />
      )}
    </PageContainer>
  )
}
