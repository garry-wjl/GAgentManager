import { Button, Space, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import type { MCPItem } from '../../types'
import { getMCPs, deleteMCP } from '../../api/mcp'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  UNCONNECTED: { text: '未连接', color: 'default' },
  CONNECTED: { text: '已连接', color: 'green' },
  ERROR: { text: '异常', color: 'red' },
}

const STATUS_OPTIONS: Record<string, { text: string }> = {
  '未连接': { text: '未连接' },
  '已连接': { text: '已连接' },
  '异常': { text: '异常' },
}

const ENABLE_OPTIONS: Record<string, { text: string }> = {
  '是': { text: '是' },
  '否': { text: '否' },
}

const ellipsisStyle: React.CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

function toMCPItem(vo: Record<string, unknown>): MCPItem {
  const rawStatus = String(vo.status || 'UNCONNECTED')
  const statusInfo = STATUS_MAP[rawStatus] || STATUS_MAP.UNCONNECTED
  return {
    mcpId: String(vo.id || ''),
    num: String(vo.num || ''),
    mcpCode: String(vo.mcpCode || ''),
    mcpName: String(vo.mcpName || ''),
    status: statusInfo.text as '已启用' | '已禁用' | '异常',
    _rawStatus: rawStatus,
    isEnabled: Boolean(vo.isEnabled),
    serverUrl: String(vo.serverUrl || ''),
    protocolVersion: String(vo.protocolVersion || ''),
    transportType: String(vo.transportType || ''),
    authType: String(vo.authType || ''),
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
      title: '服务名称',
      dataIndex: 'mcpName',
      width: 140,
      ellipsis: true,
      fieldProps: { style: ellipsisStyle },
    },
    {
      title: '服务编码',
      dataIndex: 'mcpCode',
      width: 130,
      search: false,
      ellipsis: true,
      fieldProps: { style: ellipsisStyle },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueEnum: STATUS_OPTIONS,
      render: (_, r) => {
        const info = STATUS_MAP[r._rawStatus || ''] || STATUS_MAP.UNCONNECTED
        return <Tag color={info.color}>{info.text}</Tag>
      },
    },
    {
      title: '启用',
      dataIndex: 'isEnabled',
      width: 70,
      valueEnum: ENABLE_OPTIONS,
      search: false,
      render: (_, r) => r.isEnabled ? <Tag color="green">是</Tag> : <Tag color="default">否</Tag>,
    },
    {
      title: '传输类型',
      dataIndex: 'transportType',
      width: 100,
      search: false,
      ellipsis: true,
      fieldProps: { style: ellipsisStyle },
    },
    {
      title: '协议版本',
      dataIndex: 'protocolVersion',
      width: 100,
      search: false,
    },
    {
      title: '服务器地址',
      dataIndex: 'serverUrl',
      width: 220,
      search: false,
      ellipsis: true,
      render: (_, r) => <span title={r.serverUrl || ''} style={ellipsisStyle}>{r.serverUrl || '-'}</span>,
    },
    {
      title: '认证方式',
      dataIndex: 'authType',
      width: 110,
      search: false,
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
          {r.isEnabled === false && (
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
          const statusMapReverse: Record<string, string> = { '未连接': 'UNCONNECTED', '已连接': 'CONNECTED', '异常': 'ERROR' }
          apiParams.status = statusMapReverse[String(status)] || status
        }
        setSearchParams(apiParams as Record<string, string>, { replace: true })
        const res = await getMCPs(apiParams)
        const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
        return {
          data: records.map((r) => toMCPItem(r)),
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
