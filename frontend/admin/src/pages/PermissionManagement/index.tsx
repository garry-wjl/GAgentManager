import { useState, useEffect } from 'react'
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select, message,
  Popconfirm, Drawer, Descriptions, Typography, Row, Col, Tree, Checkbox, Divider,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, SettingOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { RoleItem, PermissionResource } from '../../types'
import { getRoles, createRole, updateRole, deleteRole, enableRole, disableRole, getPermissionResources, setRolePermissions, getRoleUsers, assignUserToRole, removeUserFromRole } from '../../api/permission'

const { Title } = Typography

/** 将后端 RoleVO 转换为前端 RoleItem */
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
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [permDrawerOpen, setPermDrawerOpen] = useState(false)
  const [userDrawerOpen, setUserDrawerOpen] = useState(false)
  const [current, setCurrent] = useState<RoleItem | null>(null)
  const [form] = Form.useForm()
  const [resources, setResources] = useState<PermissionResource[]>([])
  const [roleUsers, setRoleUsers] = useState<unknown[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({ keyword: '', isEnabled: '' as string })

  useEffect(() => {
    loadRoles()
    loadResources()
  }, [])

  const loadRoles = async (overrideFilters?: Record<string, unknown>) => {
    setLoading(true)
    try {
      const activeFilters = overrideFilters ?? filters
      const params: Record<string, unknown> = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      }
      if (activeFilters.keyword) params.keyword = activeFilters.keyword
      if (activeFilters.isEnabled !== undefined && activeFilters.isEnabled !== '') params.isEnabled = activeFilters.isEnabled === 'true'

      const res = await getRoles(params)
      const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
      setRoles(records.map(toRoleItem))
      setPagination(p => ({ ...p, total: Number(res.data.data?.total || 0) }))
    } catch {
      message.error('加载角色列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, keyword: value }
    setFilters(newFilters)
    setPagination(p => ({ ...p, current: 1 }))
    loadRoles(newFilters)
  }

  const handleFilterChange = (value: string) => {
    const newFilters = { ...filters, isEnabled: value }
    setFilters(newFilters)
    setPagination(p => ({ ...p, current: 1 }))
    loadRoles(newFilters)
  }

  const handleReset = () => {
    setFilters({ keyword: '', isEnabled: '' })
    setPagination(p => ({ ...p, current: 1 }))
    loadRoles({ keyword: '', isEnabled: '' })
  }

  const loadResources = async () => {
    try {
      const res = await getPermissionResources()
      setResources(res.data.data || [])
    } catch {
      // 静默失败
    }
  }

  const columns: ColumnsType<RoleItem> = [
    { title: '角色编码', dataIndex: 'roleCode', width: 150 },
    { title: '角色名称', dataIndex: 'roleName', width: 150 },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '类型',
      dataIndex: 'isSystem',
      width: 80,
      render: (v) => v ? <Tag color="blue">内置</Tag> : <Tag>自定义</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      width: 80,
      render: (v) => v ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>,
    },
    { title: '用户数', dataIndex: 'userCount', width: 80 },
    { title: '权限数', dataIndex: 'permissionCount', width: 80 },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => { setCurrent(record); setPermDrawerOpen(true) }}>权限配置</Button>
          <Button type="link" size="small" icon={<UserOutlined />} onClick={() => { setCurrent(record); loadRoleUsers(record); setUserDrawerOpen(true) }}>用户管理</Button>
          {!record.isSystem && (
            <>
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(record); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>
              <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
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
      loadRoles()
    } catch {
      message.error('删除失败')
    }
  }

  const handleSubmit = async (values: { roleCode: string; roleName: string; description?: string; isEnabled: boolean }) => {
    try {
      if (current) {
        await updateRole({ ...values, id: current.roleId })
        message.success('修改成功')
      } else {
        await createRole({ ...values, permissions: [], isEnabled: values.isEnabled })
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      setCurrent(null)
      loadRoles()
    } catch {
      message.error('操作失败')
    }
  }

  const handleSavePermissions = async () => {
    try {
      await setRolePermissions(current!.roleId, [])
      message.success('权限保存成功')
      setPermDrawerOpen(false)
    } catch {
      message.error('权限保存失败')
    }
  }

  const loadRoleUsers = async (record: RoleItem) => {
    try {
      const res = await getRoleUsers(record.roleId)
      setRoleUsers(res.data.data || [])
    } catch {
      setRoleUsers([])
    }
  }

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeUserFromRole(userId, current!.roleId)
      message.success('移除成功')
      loadRoleUsers(current!)
    } catch {
      message.error('移除失败')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>权限管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null); form.resetFields(); setModalOpen(true) }}>
          新增角色
        </Button>
      </div>

      {/* 搜索/筛选栏 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={10}>
          <Input.Search
            placeholder="搜索角色名称/编码"
            allowClear
            enterButton={<SearchOutlined />}
            value={filters.keyword}
            onChange={(e) => setFilters(f => ({ ...f, keyword: e.target.value }))}
            onSearch={handleSearch}
          />
        </Col>
        <Col xs={12} sm={5}>
          <Select
            style={{ width: '100%' }}
            placeholder="启用状态筛选"
            value={filters.isEnabled || undefined}
            onChange={(v) => handleFilterChange(v)}
            options={[
              { label: '全部', value: '' },
              { label: '已启用', value: 'true' },
              { label: '已禁用', value: 'false' },
            ]}
            allowClear
          />
        </Col>
        <Col xs={12} sm={9} style={{ textAlign: 'right' }}>
          <Button onClick={handleReset}>重置</Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="roleId"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (page, size) => { setPagination({ current: page, pageSize: size, total: pagination.total }); loadRoles() },
        }}
      />

      <Modal
        title={current ? '编辑角色' : '新增角色'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ isEnabled: true }}>
          <Form.Item name="roleCode" label="角色编码" rules={[{ required: true }]}>
            <Input placeholder="字母开头，仅字母数字下划线" />
          </Form.Item>
          <Form.Item name="roleName" label="角色名称" rules={[{ required: true }]}>
            <Input placeholder="2-50字符" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="isEnabled" label="状态" valuePropName="checked">
            <Checkbox>启用此角色</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={`权限配置 - ${current?.roleName}`}
        open={permDrawerOpen}
        onClose={() => setPermDrawerOpen(false)}
        width={720}
      >
        <Typography.Paragraph type="secondary">为角色配置各模块的操作权限</Typography.Paragraph>
        {resources.map((mod) => (
          <div key={mod.resourceId} style={{ marginBottom: 16 }}>
            <Title level={5}>{mod.resourceName}</Title>
            <Row gutter={[8, 8]}>
              {mod.children?.map((child) => (
                <Col key={child.resourceId} span={24} style={{ marginLeft: 24 }}>
                  <Checkbox>{child.resourceName}</Checkbox>
                </Col>
              ))}
            </Row>
            <Divider style={{ margin: '12px 0' }} />
          </div>
        ))}
        <Button type="primary" onClick={handleSavePermissions}>保存权限</Button>
      </Drawer>

      <Drawer
        title={`用户管理 - ${current?.roleName}`}
        open={userDrawerOpen}
        onClose={() => setUserDrawerOpen(false)}
        width={720}
      >
        <Typography.Paragraph type="secondary">管理已关联此角色的用户</Typography.Paragraph>
        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => message.info('添加用户')}>
          添加用户
        </Button>
        <Table
          columns={[
            { title: '用户名', dataIndex: 'username' },
            { title: '姓名', dataIndex: 'realName' },
            { title: '分配时间', dataIndex: 'createTime' },
            {
              title: '操作',
              key: 'action',
              render: (_: any, record: Record<string, unknown>) => (
                <Popconfirm title="确定移除？" onConfirm={() => handleRemoveUser(String(record.userId))}>
                  <Button type="link" size="small" danger>移除</Button>
                </Popconfirm>
              ),
            },
          ]}
          dataSource={roleUsers as Record<string, unknown>[]}
          rowKey="userId"
          locale={{ emptyText: '暂无关联用户' }}
        />
      </Drawer>
    </div>
  )
}
