import { Button, Space, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { ProTable, ModalForm, ProFormText, ProFormSwitch, ProFormTextArea } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import type { RoleItem } from '../../types'
import { getRoles, createRole, updateRole, deleteRole } from '../../api/permission'
import { useState } from 'react'

function toRoleItem(vo: Record<string, unknown>): RoleItem {
  return {
    roleId: String(vo.id || ''),
    num: String(vo.num || ''),
    roleCode: String(vo.roleCode || ''),
    roleName: String(vo.roleName || ''),
    description: String(vo.description || ''),
    isSystem: Boolean(vo.isSystem),
    isEnabled: Boolean(vo.isEnabled),
    userCount: Number(vo.userCount || 0),
    permissionCount: Number(vo.permissionCount || 0),
    creator: String(vo.createNo || ''),
    createTime: String(vo.createTime || ''),
    updater: String(vo.updateNo || ''),
    updateTime: String(vo.updateTime || ''),
  }
}

export default function PermissionManagement() {
  const [current, setCurrent] = useState<RoleItem | null>(null)

  const columns: ProColumns<RoleItem>[] = [
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      width: 150,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '类型',
      dataIndex: 'isSystem',
      width: 80,
      valueEnum: {
        true: { text: '内置' },
        false: { text: '自定义' },
      },
      render: (_, r) => r.isSystem ? <Tag color="blue">内置</Tag> : <Tag>自定义</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      width: 80,
      valueEnum: {
        true: { text: '启用' },
        false: { text: '禁用' },
      },
      render: (_, r) => r.isEnabled ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>,
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      width: 80,
      search: false,
    },
    {
      title: '权限数',
      dataIndex: 'permissionCount',
      width: 80,
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
          <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => { setCurrent(r); message.info('权限配置开发中') }}>权限配置</Button>
          <Button type="link" size="small" icon={<UserOutlined />} onClick={() => { setCurrent(r); message.info('用户管理开发中') }}>用户管理</Button>
          {!r.isSystem && (
            <>
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(r) }}>编辑</Button>
              <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r)}>
                <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ]

  const handleDelete = async (record: RoleItem) => {
    try {
      await deleteRole(record.num!)
      message.success('删除成功')
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <>
      <ProTable<RoleItem>
        columns={columns}
        rowKey="roleId"
        scroll={{ x: 1200 }}
        request={async (params) => {
          const res = await getRoles({
            pageNo: params.current ?? 1,
            pageSize: params.pageSize ?? 10,
            ...params,
          } as Record<string, unknown>)
          const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
          return {
            data: records.map(toRoleItem),
            success: true,
            total: Number(res.data.data?.total || 0),
          }
        }}
        headerTitle="权限管理"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null) }}>
            新增角色
          </Button>,
        ]}
        pagination={{
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
        }}
      />

      <ModalForm<{ roleCode: string; roleName: string; description?: string; isEnabled: boolean }>
        title={current ? '编辑角色' : '新增角色'}
        open={!!current}
        onOpenChange={(open) => { if (!open) setCurrent(null) }}
        onFinish={async (values) => {
          try {
            if (current?.roleId) {
              await updateRole({ ...values, id: current.roleId })
              message.success('修改成功')
            } else {
              await createRole({ ...values, permissions: [] })
              message.success('创建成功')
            }
            setCurrent(null)
            return true
          } catch {
            message.error('操作失败')
            return false
          }
        }}
        initialValues={{ isEnabled: true }}
      >
        <ProFormText name="roleCode" label="角色编码" rules={[{ required: true }]} placeholder="字母开头，仅字母数字下划线" disabled={!!current?.isSystem} />
        <ProFormText name="roleName" label="角色名称" rules={[{ required: true }]} placeholder="2-50字符" />
        <ProFormTextArea name="description" label="描述" />
        <ProFormSwitch name="isEnabled" label="状态" />
      </ModalForm>
    </>
  )
}
