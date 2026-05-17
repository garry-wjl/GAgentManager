import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Button, Space, Tag, message, Popconfirm, Form, Input, Select, Descriptions, Radio, Tabs, Table, Tooltip, Tree } from 'antd'
import type { DescriptionsProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EditOutlined, SaveOutlined, DeleteOutlined, StopOutlined, PlayCircleOutlined, ThunderboltOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { getMCPByNum, createMCP, updateMCP, deleteMCP, enableMCP, disableMCP, testMCP, getMCPTools } from '../../api/mcp'
import type { MCPItem, MCPFormValues, MCPToolItem, ParamNode } from '../../types'

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  DRAFT: { text: '草稿', color: 'default' },
  ENABLED: { text: '已启用', color: 'green' },
  DISABLED: { text: '已禁用', color: 'default' },
}

const FORM_LAYOUT = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
}

function toMCPItem(vo: Record<string, unknown>): MCPItem {
  const rawStatus = String(vo.status || 'DRAFT')
  const statusInfo = STATUS_MAP[rawStatus] || STATUS_MAP.DRAFT
  return {
    mcpId: String(vo.id || ''),
    num: String(vo.num || ''),
    mcpName: String(vo.mcpName || ''),
    description: String(vo.description || ''),
    feature: String(vo.feature || ''),
    tags: String(vo.tags || ''),
    source: String(vo.source || 'MANUAL') as 'MCP_GATEWAY' | 'MANUAL',
    status: statusInfo.text as '草稿' | '已启用' | '已禁用',
    _rawStatus: rawStatus,
    icon: String(vo.icon || ''),
    configJson: String(vo.configJson || ''),
    requestHeaders: String(vo.requestHeaders || ''),
    boundAgentCount: Number(vo.boundAgentCount || 0),
    creator: String(vo.creator || ''),
    createTime: vo.createTime ? new Date(vo.createTime as number).toLocaleString('zh-CN') : '',
    updater: String(vo.updateNo || ''),
    updateTime: vo.updateTime ? new Date(vo.updateTime as number).toLocaleString('zh-CN') : '',
  }
}

function parseConfig(configJson: string) {
  try {
    if (!configJson) return { type: 'SSE' as const, url: '', headers: [] }
    const c = JSON.parse(configJson)
    return { type: c.type || 'SSE', url: c.url || '', headers: c.headers || [] }
  } catch {
    return { type: 'SSE' as const, url: '', headers: [] }
  }
}

function parseHeaders(headersStr: string) {
  try {
    if (!headersStr) return []
    return JSON.parse(headersStr) as Array<{ key: string; value: string }>
  } catch {
    return []
  }
}

function renderParamTree(nodes: ParamNode[] | undefined) {
  if (!nodes || nodes.length === 0) return '-'
  const treeData = nodes.map((n) => ({
    key: n.fieldName,
    title: <span><b>{n.fieldName}</b> <Tag style={{ marginLeft: 4 }}>{n.type}</Tag>{n.description && <Tooltip title={n.description}><span style={{ marginLeft: 4, color: '#999' }}>{n.description}</span></Tooltip>}</span>,
    children: n.children?.length ? renderParamTreeData(n.children) : undefined,
  }))
  return <Tree treeData={treeData as any} showLine defaultExpandAll selectable={false} />
}

function renderParamTreeData(nodes: ParamNode[]): Array<{ key: string; title: React.ReactNode; children?: unknown[] }> {
  return nodes.map((n) => ({
    key: n.fieldName,
    title: <span><b>{n.fieldName}</b> <Tag style={{ marginLeft: 4 }}>{n.type}</Tag>{n.description && <Tooltip title={n.description}><span style={{ marginLeft: 4, color: '#999' }}>{n.description}</span></Tooltip>}</span>,
    children: n.children?.length ? renderParamTreeData(n.children) : undefined,
  }))
}

const statusEnumOptions = [
  { label: '草稿', value: '草稿' },
  { label: '已启用', value: '已启用' },
  { label: '已禁用', value: '已禁用' },
]

const sourceOptions = [
  { label: '人工导入', value: 'MANUAL' },
  { label: 'MCP网关', value: 'MCP_GATEWAY' },
]

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
  const [tools, setTools] = useState<MCPToolItem[]>([])
  const [toolsLoading, setToolsLoading] = useState(false)
  const headers = Form.useWatch('headers', form)

  const listState = (location.state as { fromList?: boolean; search?: string } | null)
  const listBackUrl = listState?.fromList ? `/mcps?${listState.search || ''}` : '/mcps'

  useEffect(() => {
    if (!isNew && num) {
      loadDetail()
    }
  }, [num, isNew])

  useEffect(() => {
    if (editing && mcp) {
      const cfg = parseConfig(mcp.configJson || '')
      const hdrs = parseHeaders(mcp.requestHeaders || '')
      form.setFieldsValue({
        mcpName: mcp.mcpName,
        description: mcp.description,
        feature: mcp.feature,
        tags: mcp.tags,
        source: mcp.source,
        status: mcp.status,
        icon: mcp.icon,
        configType: cfg.type,
        configUrl: cfg.url,
        headers: hdrs.length ? hdrs : [{ key: '', value: '' }],
      })
    }
  }, [editing, mcp])

  useEffect(() => {
    if (isNew) {
      form.setFieldsValue({
        source: 'MANUAL',
        status: '草稿',
        configType: 'SSE',
      })
    }
  }, [isNew])

  useEffect(() => {
    if (mcp && !isNew && !editing) {
      loadTools()
    }
  }, [mcp, isNew, editing])

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

  const loadTools = async () => {
    if (!num) return
    setToolsLoading(true)
    try {
      const res = await getMCPTools(num)
      setTools((res.data.data as MCPToolItem[]) || [])
    } catch {
      // 工具列表加载失败不影响页面展示
    } finally {
      setToolsLoading(false)
    }
  }

  const buildPayload = (values: Record<string, unknown>) => {
    const cfg: Record<string, unknown> = {
      type: values.configType,
      url: values.configUrl,
      headers: (values.headers as Array<{ key: string; value: string }> || []).filter((h) => h.key),
    }
    return {
      mcpName: values.mcpName,
      description: values.description,
      feature: values.feature,
      tags: values.tags,
      icon: values.icon,
      source: values.source || 'MANUAL',
      status: mapStatusToBackend(values.status as string),
      configJson: JSON.stringify(cfg),
      requestHeaders: JSON.stringify((values.headers as Array<{ key: string; value: string }> || []).filter((h) => h.key)),
    }
  }

  const mapStatusToBackend = (status: string) => {
    const map: Record<string, string> = { '草稿': 'DRAFT', '已启用': 'ENABLED', '已禁用': 'DISABLED' }
    return map[status] || 'DRAFT'
  }

  const handleSave = async (values: Record<string, unknown>) => {
    setSaving(true)
    try {
      const payload = buildPayload(values)
      if (isNew) {
        await createMCP(payload as unknown as MCPFormValues)
        message.success('创建成功')
        navigate(listBackUrl)
      } else {
        await updateMCP({ ...payload, num: mcp!.num } as any)
        message.success('保存成功')
        setEditing(false)
        loadDetail()
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '操作失败'
      message.error(msg)
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
        message.success('连通性测试通过')
        loadTools()
        loadDetail()
      } else {
        message.error(`连通性测试失败：${result?.errorMessage || '未知错误'}`)
      }
    } catch {
      message.error('连通性测试失败')
    }
  }

  const statusInfo = mcp ? STATUS_MAP[mcp._rawStatus || ''] || STATUS_MAP.DRAFT : null
  const pageTitle = isNew ? '新增MCP' : (editing ? '编辑MCP' : 'MCP详情')
  const isEditMode = isNew || editing

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
      <Button icon={<ThunderboltOutlined />} onClick={handleTest}>测试连通性</Button>
      {mcp?.status === '草稿' && (
        <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleEnable}>启用</Button>
      )}
      {mcp?.status === '已启用' && (
        <Popconfirm title="确定禁用？" onConfirm={handleDisable}>
          <Button icon={<StopOutlined />}>禁用</Button>
        </Popconfirm>
      )}
      {mcp?.status === '已禁用' && (
        <>
          <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleEnable}>启用</Button>
          <Popconfirm title="确定删除？" onConfirm={handleDelete}>
            <Button danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </>
      )}
    </Space>
  )

  const toolColumns: ColumnsType<MCPToolItem> = [
    { title: '名称', dataIndex: 'name', width: 180, ellipsis: true },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '入参',
      dataIndex: 'inputParams',
      width: 350,
      render: (params: ParamNode[]) => renderParamTree(params),
    },
    {
      title: '出参',
      dataIndex: 'outputParams',
      width: 350,
      render: (params: ParamNode[]) => renderParamTree(params),
    },
  ]

  const basicFormItems = (
    <>
      <Form.Item label="名称" name="mcpName" rules={[{ required: true, message: '请输入名称' }]}>
        <Input placeholder="2-50字符" maxLength={50} />
      </Form.Item>
      <Form.Item label="描述" name="description" rules={[{ required: true, message: '请输入描述' }]}>
        <Input.TextArea placeholder="请输入描述" rows={3} maxLength={500} showCount />
      </Form.Item>
      <Form.Item label="功能介绍" name="feature">
        <Input.TextArea placeholder="可选" rows={3} maxLength={2000} showCount />
      </Form.Item>
      <Form.Item label="标签" name="tags">
        <Input placeholder="多个标签用逗号分隔" />
      </Form.Item>
      <Form.Item label="来源" name="source">
        <Select options={sourceOptions} />
      </Form.Item>
      <Form.Item label="状态" name="status">
        <Select options={statusEnumOptions} />
      </Form.Item>
      <Form.Item label="图标" name="icon">
        <Input placeholder="图标URL或Emoji" />
      </Form.Item>
    </>
  )

  const configFormItems = (
    <>
      <Form.Item label="类型" name="configType" rules={[{ required: true, message: '请选择类型' }]}>
        <Radio.Group>
          <Radio value="SSE">SSE</Radio>
          <Radio value="STREAMABLE_HTTP">STREAMABLE HTTP</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="URL" name="configUrl">
        <Input placeholder="https://mcp.example.com/mcp" />
      </Form.Item>
      <Form.Item label="请求头" name="headers">
        <Form.List name="headers">
          {(fields, { add, remove }) => (
            <div style={{ width: '100%' }}>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item {...restField} name={[name, 'key']} style={{ width: 200 }}>
                    <Input placeholder="Key" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'value']} style={{ width: 300 }}>
                    <Input placeholder="Value" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add({ key: '', value: '' })} block icon={<PlusOutlined />}>
                添加请求头
              </Button>
            </div>
          )}
        </Form.List>
      </Form.Item>
    </>
  )

  const BasicInfoDetail = () => {
    if (!mcp) return null
    const items: DescriptionsProps['items'] = [
      { key: 'mcpName', label: '名称', children: mcp.mcpName },
      { key: 'description', label: '描述', children: mcp.description || '-' },
      { key: 'feature', label: '功能介绍', children: mcp.feature || '-' },
      { key: 'tags', label: '标签', children: mcp.tags || '-' },
      { key: 'source', label: '来源', children: mcp.source === 'MCP_GATEWAY' ? 'MCP网关' : '人工导入' },
      { key: 'status', label: '状态', children: <Tag color={statusInfo?.color}>{statusInfo?.text}</Tag> },
      { key: 'icon', label: '图标', children: mcp.icon ? <img src={mcp.icon} alt="" style={{ width: 32, height: 32 }} /> : '-' },
    ]
    return <Descriptions column={2} items={items} size="small" bordered />
  }

  const ConfigDetail = () => {
    if (!mcp) return null
    const cfg = parseConfig(mcp.configJson || '')
    const hdrs = parseHeaders(mcp.requestHeaders || '')
    const items: DescriptionsProps['items'] = [
      { key: 'type', label: '类型', children: cfg.type },
      { key: 'url', label: 'URL', children: cfg.url || '-' },
      {
        key: 'headers', label: '请求头', span: 2,
        children: hdrs.length ? (
          hdrs.map((h, i) => <div key={i}><b>{h.key}</b>: {h.value}</div>)
        ) : '-',
      },
    ]
    return <Descriptions column={2} items={items} size="small" bordered />
  }

  const tabItems = isEditMode ? [
    {
      key: 'basic',
      label: '基础信息',
      children: <>{basicFormItems}</>,
    },
    {
      key: 'config',
      label: 'MCP配置',
      children: <>{configFormItems}</>,
    },
    {
      key: 'tools',
      label: '工具列表',
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button icon={<ThunderboltOutlined />} onClick={handleTest} loading={toolsLoading}>
              测试连通性并刷新
            </Button>
            {isNew && <span style={{ marginLeft: 12, color: '#999' }}>请先保存MCP后点击测试连通性加载工具</span>}
          </div>
          <Table
            columns={toolColumns}
            dataSource={tools}
            rowKey="name"
            loading={toolsLoading}
            pagination={false}
            size="small"
            scroll={{ x: 1200 }}
            locale={{ emptyText: isNew ? '请先保存MCP后点击测试连通性加载工具' : '暂无工具数据，点击"测试连通性"加载' }}
          />
        </div>
      ),
    },
  ] : [
    {
      key: 'basic',
      label: '基础信息',
      children: <BasicInfoDetail />,
    },
    {
      key: 'config',
      label: 'MCP配置',
      children: <ConfigDetail />,
    },
    {
      key: 'tools',
      label: '工具列表',
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button icon={<ThunderboltOutlined />} onClick={handleTest} loading={toolsLoading}>
              测试连通性并刷新
            </Button>
          </div>
          <Table
            columns={toolColumns}
            dataSource={tools}
            rowKey="name"
            loading={toolsLoading}
            pagination={false}
            size="small"
            scroll={{ x: 1200 }}
            locale={{ emptyText: '暂无工具数据，点击"测试连通性"加载' }}
          />
        </div>
      ),
    },
  ]

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
      {isEditMode ? (
        <Form
          {...FORM_LAYOUT}
          form={form}
          style={{ maxWidth: 'none' }}
          initialValues={{ source: 'MANUAL', status: '草稿', configType: 'SSE' }}
          onFinish={handleSave}
        >
          <Tabs items={tabItems} />
        </Form>
      ) : (
        <Tabs items={tabItems} />
      )}
    </PageContainer>
  )
}
