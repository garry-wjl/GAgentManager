import { Button, Space, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserSwitchOutlined, KeyOutlined } from '@ant-design/icons'
import { ProTable, ModalForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import type { UserListItem, UserStatus, UserSource } from '../../types'
import { getUsers, createUser, updateUser, deleteUser, enableUser, disableUser, resetUserPassword } from '../../api/user'
import { useState } from 'react'

const statusColor: Record<UserStatus, string> = {
  '已启用': 'green',
  '已禁用': 'red',
  '已离职': 'default',
  '已删除': 'default',
}

const STATUS_OPTIONS: Record<string, { text: string }> = {
  '已启用': { text: '已启用' },
  '已禁用': { text: '已禁用' },
  '已离职': { text: '已离职' },
}

/** 将后端 UserVO 转换为前端 UserListItem */
function toUserListItem(vo: Record<string, unknown>): UserListItem {
  return {
    userId: String(vo.id || ''),
    num: String(vo.num || ''),
    username: String(vo.username || ''),
    realName: String(vo.realName || ''),
    nickname: String(vo.nickname || ''),
    email: String(vo.email || ''),
    phone: String(vo.phone || ''),
    source: (vo.source as UserSource) || '手动创建',
    status: (vo.status as UserStatus) || '已启用',
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
  const [current, setCurrent] = useState<UserListItem | null>(null)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetForm] = useState({ newPassword: '', confirmNewPassword: '' })

  const columns: ProColumns<UserListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
      search: false,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
      search: false,
    },
    {
      title: '角色',
      dataIndex: 'roleNames',
      width: 150,
      search: false,
      render: (_, r) => r.roleNames.map((role) => <Tag key={role}>{role}</Tag>),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueEnum: STATUS_OPTIONS,
      render: (_, r) => <Tag color={statusColor[r.status]}>{r.status}</Tag>,
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 100,
      search: false,
    },
    {
      title: '最近登录',
      dataIndex: 'lastLoginTime',
      width: 170,
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
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(r); /* 触发编辑 */ }}>编辑</Button>
          {r.status === '已启用' && (
            <Popconfirm title="确定禁用？" onConfirm={() => handleDisable(r)}>
              <Button type="link" size="small" danger>禁用</Button>
            </Popconfirm>
          )}
          {r.status === '已禁用' && (
            <Button type="link" size="small" onClick={() => handleEnable(r)}>启用</Button>
          )}
          <Button type="link" size="small" icon={<KeyOutlined />} onClick={() => { setCurrent(r); setResetOpen(true) }}>重置密码</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleEnable = async (record: UserListItem) => {
    try {
      await enableUser(record.num!)
      message.success('启用成功')
    } catch {
      message.error('启用失败')
    }
  }

  const handleDisable = async (record: UserListItem) => {
    try {
      await disableUser(record.num!)
      message.success('禁用成功')
    } catch {
      message.error('禁用失败')
    }
  }

  const handleDelete = async (record: UserListItem) => {
    try {
      await deleteUser(record.num!)
      message.success('删除成功')
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <>
      <ProTable<UserListItem>
        columns={columns}
        rowKey="userId"
        scroll={{ x: 1400 }}
        request={async (params) => {
          const res = await getUsers({
            pageNo: params.current ?? 1,
            pageSize: params.pageSize ?? 10,
            ...params,
          } as Record<string, unknown>)
          const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
          return {
            data: records.map(toUserListItem),
            success: true,
            total: Number(res.data.data?.total || 0),
          }
        }}
        headerTitle="用户管理"
        toolBarRender={() => [
          <Button key="batch" icon={<UserSwitchOutlined />}>批量操作</Button>,
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null) }}>
            新增用户
          </Button>,
        ]}
        pagination={{
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
        }}
      />

      <ModalForm
        title={current ? '编辑用户' : '新增用户'}
        open={!!current}
        onOpenChange={(open) => { if (!open) { setCurrent(null) } }}
        onFinish={async (values: Record<string, unknown>) => {
          try {
            if (current?.userId) {
              await updateUser({ ...values as Record<string, unknown>, id: current.userId } as any)
              message.success('修改成功')
            } else {
              await createUser(values as any)
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
      >
        <ProFormText name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]} placeholder="3-30字符" disabled={!!current} />
        {!current && (
          <ProFormText.Password name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]} placeholder="8-32字符" />
        )}
        <ProFormText name="realName" label="姓名" rules={[{ required: true }]} placeholder="2-50字符" />
        <ProFormText name="email" label="邮箱" rules={[{ required: true, type: 'email' }]} placeholder="邮箱地址" />
        <ProFormText name="phone" label="手机号" placeholder="11位手机号" />
        <ProFormText name="department" label="部门" placeholder="所属部门" />
        <ProFormSelect
          name="status"
          label="状态"
          initialValue="已启用"
          options={[
            { label: '已启用', value: '已启用' },
            { label: '已禁用', value: '已禁用' },
          ]}
        />
        <ProFormTextArea name="notes" label="备注" />
      </ModalForm>

      <ModalForm<{ newPassword: string; confirmNewPassword: string }>
        title="重置密码"
        open={resetOpen}
        onOpenChange={setResetOpen}
        initialValues={resetForm}
        onFinish={async (values) => {
          if (values.newPassword !== values.confirmNewPassword) {
            message.error('两次输入的密码不一致')
            return false
          }
          try {
            await resetUserPassword(current!.num!, values.newPassword)
            message.success('密码重置成功')
            return true
          } catch {
            message.error('密码重置失败')
            return false
          }
        }}
      >
        <ProFormText.Password name="newPassword" label="新密码" rules={[{ required: true }]} placeholder="8-32字符" />
        <ProFormText.Password name="confirmNewPassword" label="确认密码" rules={[{ required: true }]} placeholder="再次输入密码" />
      </ModalForm>
    </>
  )
}
