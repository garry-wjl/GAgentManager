import { Button, Space, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import type { MCPItem } from '../../types'
import { getMCPs, deleteMCP } from '../../api/mcp'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  DRAFT: { text: '草稿', color: 'default' },
  ENABLED: { text: '已启用', color: 'green' },
  DISABLED: { text: '已禁用', color: 'default' },
}

const STATUS_OPTIONS: Record<string, { text: string }> = {
  '草稿': { text: '草稿' },
  '已启用': { text: '已启用' },
  '已禁用': { text: '已禁用' },
}

const SOURCE_MAP: Record<string, string> = {
  MCP_GATEWAY: 'MCP网关',
  MANUAL: '人工导入',
}

const ellipsisStyle: React.CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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

export default function MCPManagement() {
  const actionRef = useRef<ActionType>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const reload = () => { actionRef.current?.reload() }

  const columns: ProColumns<MCPItem>[] = [
    {
      title: '名称',
      dataIndex: 'mcpName',
      width: 160,
      ellipsis: true,
      fieldProps: { style: ellipsisStyle },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueEnum: STATUS_OPTIONS,
      render: (_, r) => {
        const rawStatus = String(r._rawStatus || 'DRAFT')
        const info = STATUS_MAP[rawStatus] || STATUS_MAP.DRAFT
        return <Tag color={info.color}>{info.text}</Tag>
      },
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 100,
      search: false,
      render: (_, r) => SOURCE_MAP[r.source] || r.source,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 150,
      search: false,
      ellipsis: true,
      render: (_, r) => r.tags ? (
        r.tags.split(',').filter(Boolean).map((t) => <Tag key={t} style={{ marginInlineEnd: 4 }}>{t.trim()}</Tag>)
      ) : '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      search: false,
      ellipsis: true,
      fieldProps: { style: ellipsisStyle },
    },
    {
      title: '绑定Agent',
      dataIndex: 'boundAgentCount',
      width: 100,
      search: false,
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
      width: 160,
      fixed: 'right',
      search: false,
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/mcps/${r.num}`, { state: { fromList: true, search: searchParams.toString() } })}>详情</Button>
          {(r.status === '草稿' || r.status === '已禁用') && (
            <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r)}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  const handleDelete = async (record: MCPItem) => {
    try {
      await deleteMCP(record.num!)
      message.success('删除成功')
      reload()
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <ProTable<MCPItem>
      actionRef={actionRef}
      columns={columns}
      rowKey="num"
      scroll={{ x: 1400 }}
      search={{
        labelWidth: 'auto',
      }}
      request={async (params) => {
        const { mcpName, status, current, pageSize } = params
        const apiParams: Record<string, unknown> = {
          pageNo: current ?? 1,
          pageSize: pageSize ?? 10,
        }
        if (mcpName) apiParams.keyword = mcpName
        if (status) {
          const statusMapReverse: Record<string, string> = { '草稿': 'DRAFT', '已启用': 'ENABLED', '已禁用': 'DISABLED' }
          apiParams.status = statusMapReverse[String(status)] || status
        }
        setSearchParams(apiParams as Record<string, string>, { replace: true })
        const res = await getMCPs(apiParams)
        const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
        return {
          data: records.map((r) => {
            const item = toMCPItem(r)
            item._rawStatus = String(r.status || 'DRAFT')
            return item
          }),
          success: true,
          total: Number(res.data.data?.total || 0),
        }
      }}
      headerTitle="MCP管理"
      toolBarRender={() => [
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => navigate('/mcps/new', { state: { fromList: true, search: searchParams.toString() } })}>
          新增MCP
        </Button>,
      ]}
      pagination={{
        showSizeChanger: true,
        showTotal: (t) => `共 ${t} 条`,
      }}
    />
  )
}
