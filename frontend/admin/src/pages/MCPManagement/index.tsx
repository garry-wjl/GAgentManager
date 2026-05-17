import { Button, Space, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { ProTable, ModalForm, ProFormText, ProFormSelect, ProFormDigit, ProFormTextArea } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import type { MCPItem, MCPStatus, MCPFormValues } from '../../types'
import { getMCPs, createMCP, updateMCP, deleteMCP, enableMCP, disableMCP, testMCPConnection } from '../../api/mcp'
import { useState } from 'react'

const statusMap: Record<MCPStatus, { text: string }> = {
  '未连接': { text: '未连接' },
  '连接中': { text: '连接中' },
  '已连接': { text: '已连接' },
  '异常': { text: '异常' },
}

const MCP_STATUS_OPTIONS: Record<string, { text: string }> = {
  '未连接': { text: '未连接' },
  '连接中': { text: '连接中' },
  '已连接': { text: '已连接' },
  '异常': { text: '异常' },
}

function toMCPItem(vo: Record<string, unknown>): MCPItem {
  return {
    mcpId: String(vo.id || ''),
    num: String(vo.num || ''),
    mcpName: String(vo.mcpName || ''),
    description: String(vo.description || ''),
    latestVersion: String(vo.latestVersion || ''),
    currentVersion: String(vo.currentVersion || ''),
    isEnabled: Boolean(vo.isEnabled),
    status: (vo.status as MCPStatus) || '未连接',
    boundAgentCount: Number(vo.boundAgentCount || 0),
    creator: String(vo.creator || ''),
    createTime: String(vo.createTime || ''),
    updater: String(vo.updateNo || ''),
    updateTime: String(vo.updateTime || ''),
    lastConnectTime: vo.lastConnectTime ? String(vo.lastConnectTime) : undefined,
    errorCount: Number(vo.errorCount || 0),
  }
}

export default function MCPManagement() {
  const [current, setCurrent] = useState<MCPItem | null>(null)
  const [testingId, setTestingId] = useState<string | null>(null)

  const columns: ProColumns<MCPItem>[] = [
    {
      title: '服务名称',
      dataIndex: 'mcpName',
      width: 130,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: MCP_STATUS_OPTIONS,
      render: (_, r) => <Tag color={r.status === '已连接' ? 'green' : r.status === '异常' ? 'red' : 'default'}>{statusMap[r.status].text}</Tag>,
    },
    {
      title: '启用',
      dataIndex: 'isEnabled',
      width: 70,
      search: false,
      render: (_, r) => r.isEnabled ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>,
    },
    {
      title: '当前版本',
      dataIndex: 'currentVersion',
      width: 100,
      search: false,
    },
    {
      title: '绑定Agent',
      dataIndex: 'boundAgentCount',
      width: 100,
      search: false,
    },
    {
      title: '错误次数',
      dataIndex: 'errorCount',
      width: 80,
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
      width: 300,
      fixed: 'right',
      search: false,
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" onClick={() => setCurrent(r)}>详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(r) }}>编辑</Button>
          <Button
            type="link"
            size="small"
            icon={<ThunderboltOutlined />}
            loading={testingId === r.mcpId}
            onClick={() => handleTest(r)}
          >测试</Button>
          {r.isEnabled ? (
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

  const handleTest = async (record: MCPItem) => {
    setTestingId(record.mcpId)
    try {
      const res = await testMCPConnection(record.num!)
      message.success(res.data.data?.success ? '连通性测试通过' : `测试失败: ${res.data.data?.errorMessage}`)
    } catch {
      message.error('测试失败')
    } finally {
      setTestingId(null)
    }
  }

  const handleEnable = async (record: MCPItem) => {
    try {
      await enableMCP(record.num!)
      message.success('启用成功')
    } catch {
      message.error('启用失败')
    }
  }

  const handleDisable = async (record: MCPItem) => {
    try {
      await disableMCP(record.num!)
      message.success('禁用成功')
    } catch {
      message.error('禁用失败')
    }
  }

  const handleDelete = async (record: MCPItem) => {
    try {
      await deleteMCP(record.num!)
      message.success('删除成功')
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <>
      <ProTable<MCPItem>
        columns={columns}
        rowKey="mcpId"
        scroll={{ x: 1400 }}
        request={async (params) => {
          const res = await getMCPs({
            pageNo: params.current ?? 1,
            pageSize: params.pageSize ?? 10,
            ...params,
          } as Record<string, unknown>)
          const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
          return {
            data: records.map(toMCPItem),
            success: true,
            total: Number(res.data.data?.total || 0),
          }
        }}
        headerTitle="MCP管理"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null) }}>
            新增MCP
          </Button>,
        ]}
        pagination={{
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
        }}
      />

      <ModalForm<MCPFormValues>
        title={current ? '编辑MCP' : '新增MCP'}
        open={!!current}
        onOpenChange={(open) => { if (!open) setCurrent(null) }}
        onFinish={async (values) => {
          try {
            if (current) {
              await updateMCP({ ...values, id: current.mcpId })
              message.success('修改成功')
            } else {
              await createMCP(values)
              message.success('创建成功')
            }
            setCurrent(null)
            return true
          } catch {
            message.error('操作失败')
            return false
          }
        }}
        width={720}
        initialValues={{ protocolVersion: 'v1.0', transportType: 'sse', authType: '无认证', timeoutSeconds: 30, maxRetries: 3, healthCheckInterval: 60 }}
      >
        <ProFormText name="mcpName" label="服务名称" rules={[{ required: true }]} placeholder="2-50字符" />
        <ProFormText name="serverUrl" label="服务器地址" rules={[{ required: true }]} placeholder="http://localhost:8080" />
        <ProFormTextArea name="description" label="描述" />
        <ProFormSelect
          name="protocolVersion"
          label="协议版本"
          options={[{ label: 'v1.0', value: 'v1.0' }, { label: 'v1.1', value: 'v1.1' }, { label: 'v2.0', value: 'v2.0' }]}
        />
        <ProFormSelect
          name="transportType"
          label="传输类型"
          options={[{ label: 'stdio', value: 'stdio' }, { label: 'sse', value: 'sse' }, { label: 'http', value: 'http' }]}
        />
        <ProFormSelect
          name="authType"
          label="认证方式"
          options={[
            { label: '无认证', value: '无认证' },
            { label: 'API Key', value: 'API Key' },
            { label: 'Bearer Token', value: 'Bearer Token' },
            { label: 'OAuth2.0', value: 'OAuth2.0' },
            { label: 'Basic Auth', value: 'Basic Auth' },
          ]}
        />
        <ProFormDigit name="timeoutSeconds" label="超时时间(秒)" min={5} max={300} />
        <ProFormDigit name="maxRetries" label="最大重试次数" min={0} max={10} />
        <ProFormDigit name="healthCheckInterval" label="健康检查间隔(秒)" min={10} max={300} />
      </ModalForm>
    </>
  )
}
