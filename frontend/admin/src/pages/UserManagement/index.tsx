import { Button, Space, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import type { UserListItem, UserSource } from '../../types'
import { getUsers, deleteUser } from '../../api/user'
import { useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const statusMap: Record<string, { text: string; color: string }> = {
  DRAFT: { text: '草稿', color: 'default' },
  ENABLED: { text: '启用', color: 'green' },
  DISABLED: { text: '禁用', color: 'red' },
  RESIGNED: { text: '离职', color: 'orange' },
}

const sourceMap: Record<string, string> = {
  MANUAL: '手动创建',
  IMPORT: '导入',
  SSO: 'SSO',
  INVITE: '邀请注册',
  API: 'API创建',
}

/** 将后端 UserVO 转换为前端 UserListItem */
function toUserListItem(vo: Record<string, unknown>): UserListItem {
  const rawStatus = String(vo.status || 'DRAFT')
  const rawSource = String(vo.source || 'MANUAL')

  return {
    userId: String(vo.id || ''),
    num: String(vo.num || ''),
    username: String(vo.username || ''),
    realName: String(vo.realName || ''),
    nickname: String(vo.nickname || ''),
    email: String(vo.email || ''),
    phone: String(vo.phone || ''),
    source: (sourceMap[rawSource] || '手动创建') as UserSource,
    status: rawStatus as UserListItem['status'],
    roleNames: (vo.roleNames as string[]) || [],
    department: String(vo.department || ''),
    avatar: String(vo.avatar || ''),
    notes: String(vo.notes || ''),
    mfaEnabled: Boolean(vo.mfaEnabled),
    lastLoginTime: vo.lastLoginTime ? String(vo.lastLoginTime) : undefined,
    lastLoginIp: String(vo.lastLoginIp || ''),
    loginFailCount: Number(vo.loginFailCount || 0),
    expireTime: vo.expireTime ? String(vo.expireTime) : undefined,
    creator: String(vo.createNo || ''),
    createTime: String(vo.createTime || ''),
    updater: String(vo.updateNo || ''),
    updateTime: String(vo.updateTime || ''),
  }
}

export default function UserManagement() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const actionRef = useRef<ActionType>()

  const columns: ProColumns<UserListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
      ellipsis: true,
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      width: 100,
      ellipsis: true,
      search: false,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
      ellipsis: true,
      search: false,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
      ellipsis: true,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      valueEnum: {
        DRAFT: { text: '草稿' },
        ENABLED: { text: '启用' },
        DISABLED: { text: '禁用' },
        RESIGNED: { text: '离职' },
      },
      render: (_, r) => {
        const info = statusMap[r.status] || { text: r.status, color: 'default' }
        return <Tag color={info.color}>{info.text}</Tag>
      },
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 100,
      ellipsis: true,
      search: false,
    },
    {
      title: '最近登录',
      dataIndex: 'lastLoginTime',
      width: 170,
      ellipsis: true,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 170,
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      search: false,
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/users/detail/${r.num}`, { state: { fromList: true, search: searchParams.toString() } })}>详情</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r)} disabled={r.status !== 'DRAFT'}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} disabled={r.status !== 'DRAFT'}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleDelete = async (record: UserListItem) => {
    try {
      await deleteUser(record.num!)
      message.success('删除成功')
      actionRef.current?.reload()
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <ProTable<UserListItem>
      columns={columns}
      rowKey="userId"
      actionRef={actionRef}
      scroll={{ x: 1400 }}
      request={async (params) => {
        const { username, realName, status, current, pageSize } = params
        // 将前端搜索参数合并为后端的 keyword 字段
        const apiParams: Record<string, unknown> = {
          pageNo: current ?? 1,
          pageSize: pageSize ?? 10,
        }
        const keyword = [username, realName].filter(Boolean).join(' ')
        if (keyword) apiParams.keyword = keyword
        if (status) apiParams.status = status
        setSearchParams(apiParams as Record<string, string>)
        const res = await getUsers(apiParams)
        const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
        return {
          data: records.map(toUserListItem),
          success: true,
          total: Number(res.data.data?.total || 0),
        }
      }}
      headerTitle="用户管理"
      toolBarRender={() => [
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => navigate('/users/detail/new', { state: { fromList: true, search: searchParams.toString() } })}>
          新增用户
        </Button>,
      ]}
      pagination={{
        showSizeChanger: true,
        showTotal: (t) => `共 ${t} 条`,
      }}
    />
  )
}
