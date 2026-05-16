import { useNavigate } from 'react-router-dom'
import { Button, Space, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, RocketOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import type { AgentItem, AgentType, AgentStatus } from '../../types'
import { publishAgent, deleteAgent, startAgent, stopAgent, getAgents } from '../../api/agent'

const AGENT_TYPE_OPTIONS: Record<string, { text: string }> = {
  '聊天型': { text: '聊天型' },
  '工作流型': { text: '工作流型' },
  '分析型': { text: '分析型' },
  '自动化型': { text: '自动化型' },
  '混合型': { text: '混合型' },
}

const STATUS_OPTIONS: Record<string, { text: string }> = {
  '未发布': { text: '未发布' },
  '已发布': { text: '已发布' },
  '已上线': { text: '已上线' },
  '已下线': { text: '已下线' },
  '异常': { text: '异常' },
  '发布中': { text: '发布中' },
}

const agentTypeMap: Record<AgentType, string> = {
  '聊天型': 'blue',
  '工作流型': 'green',
  '分析型': 'purple',
  '自动化型': 'orange',
  '混合型': 'cyan',
}

const statusMap: Record<AgentStatus, string> = {
  '未发布': 'default',
  '已发布': 'processing',
  '已上线': 'success',
  '已下线': 'warning',
  '异常': 'error',
  '发布中': 'processing',
}

/** 将后端 AgentVO 转换为前端 AgentItem */
function toAgentItem(vo: Record<string, unknown>): AgentItem {
  const admins = vo.admins ? (vo.admins as string[]) : []
  return {
    agentId: String(vo.id || ''),
    num: String(vo.num || ''),
    agentName: String(vo.agentName || ''),
    agentType: (vo.agentType as AgentType) || '聊天型',
    description: String(vo.description || ''),
    admins,
    status: (vo.status as AgentStatus) || '未发布',
    boundModel: '',
    skillCount: 0,
    mcpCount: 0,
    workflowCount: 0,
    version: String(vo.version || ''),
    creator: String(vo.createNo || ''),
    createTime: String(vo.createTime || ''),
    updater: String(vo.updateNo || ''),
    updateTime: String(vo.updateTime || ''),
  }
}

export default function AgentManagement() {
  const navigate = useNavigate()

  const columns: ProColumns<AgentItem>[] = [
    {
      title: 'Agent名称',
      dataIndex: 'agentName',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'agentType',
      width: 100,
      valueEnum: AGENT_TYPE_OPTIONS,
      render: (_, r) => <Tag color={agentTypeMap[r.agentType]}>{r.agentType}</Tag>,
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
      valueEnum: STATUS_OPTIONS,
      render: (_, r) => <Tag color={statusMap[r.status]}>{r.status}</Tag>,
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: 90,
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
      width: 280,
      fixed: 'right',
      search: false,
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" onClick={() => navigate(`/agents/${r.num}`)}>详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/agents/${r.num}`)}>编辑</Button>
          {r.status === '未发布' && (
            <Button type="link" size="small" icon={<RocketOutlined />} onClick={() => handlePublish(r)}>发布</Button>
          )}
          {r.status === '已发布' && (
            <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleStart(r)}>上线</Button>
          )}
          {r.status === '已上线' && (
            <Button type="link" size="small" icon={<PauseCircleOutlined />} onClick={() => handleStop(r)}>下线</Button>
          )}
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handlePublish = async (record: AgentItem) => {
    try {
      await publishAgent(record.num!, { version: record.version || 'V1.0.0', changeLog: '' })
      message.success('发布成功')
    } catch {
      message.error('发布失败')
    }
  }

  const handleStart = async (record: AgentItem) => {
    try {
      await startAgent(record.num!)
      message.success('上线成功')
    } catch {
      message.error('上线失败')
    }
  }

  const handleStop = async (record: AgentItem) => {
    try {
      await stopAgent(record.num!)
      message.success('下线成功')
    } catch {
      message.error('下线失败')
    }
  }

  const handleDelete = async (record: AgentItem) => {
    try {
      await deleteAgent(record.num!)
      message.success('删除成功')
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <ProTable<AgentItem>
      columns={columns}
      rowKey="agentId"
      scroll={{ x: 1400 }}
      request={async (params) => {
        const res = await getAgents({
          pageNo: params.current ?? 1,
          pageSize: params.pageSize ?? 10,
          ...params,
        } as Record<string, unknown>)
        const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
        return {
          data: records.map(toAgentItem),
          success: true,
          total: Number(res.data.data?.total || 0),
        }
      }}
      headerTitle="Agent管理"
      toolBarRender={() => [
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => navigate('/agents/new')}>
          新增Agent
        </Button>,
      ]}
      pagination={{
        showSizeChanger: true,
        showTotal: (t) => `共 ${t} 条`,
      }}
    />
  )
}
