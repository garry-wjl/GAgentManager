import { useState } from 'react'
import {
  Table, Button, Space, Tag, Modal, Form, Input, message,
  Popconfirm, Drawer, Descriptions, Typography, Row, Col, Tree, Checkbox, Divider,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, UserOutlined, CopyOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { RoleItem, PermissionResource } from '../../types'

const { Title } = Typography

const mockRoles: RoleItem[] = [
  {
    roleId: '1',
    roleCode: 'super_admin',
    roleName: '超级管理员',
    description: '拥有系统所有权限',
    isSystem: true,
    isEnabled: true,
    userCount: 1,
    permissionCount: 50,
    creator: 'system',
    createTime: '2026-01-01 00:00:00',
    updater: 'system',
    updateTime: '2026-01-01 00:00:00',
  },
  {
    roleId: '2',
    roleCode: 'developer',
    roleName: '开发者',
    description: 'Agent和模型管理权限',
    isSystem: true,
    isEnabled: true,
    userCount: 5,
    permissionCount: 20,
    creator: 'system',
    createTime: '2026-01-01 00:00:00',
    updater: 'admin',
    updateTime: '2026-04-20 10:00:00',
  },
  {
    roleId: '3',
    roleCode: 'viewer',
    roleName: '访客',
    description: '仅查看权限',
    isSystem: true,
    isEnabled: true,
    userCount: 10,
    permissionCount: 6,
    creator: 'system',
    createTime: '2026-01-01 00:00:00',
    updater: 'system',
    updateTime: '2026-01-01 00:00:00',
  },
]

const mockResources: PermissionResource[] = [
  {
    resourceId: '1',
    resourceCode: 'agent',
    resourceName: 'Agent管理',
    resourceType: '模块',
    sortOrder: 1,
    children: [
      { resourceId: '1-1', resourceCode: 'agent', resourceName: 'Agent管理', resourceType: '菜单', parentId: '1', sortOrder: 1 },
      { resourceId: '1-2', resourceCode: 'agent', resourceName: '新增', resourceType: '按钮', parentId: '1', sortOrder: 2 },
      { resourceId: '1-3', resourceCode: 'agent', resourceName: '修改', resourceType: '按钮', parentId: '1', sortOrder: 3 },
      { resourceId: '1-4', resourceCode: 'agent', resourceName: '删除', resourceType: '按钮', parentId: '1', sortOrder: 4 },
      { resourceId: '1-5', resourceCode: 'agent', resourceName: '发布', resourceType: '按钮', parentId: '1', sortOrder: 5 },
    ],
  },
  {
    resourceId: '2',
    resourceCode: 'user',
    resourceName: '用户管理',
    resourceType: '模块',
    sortOrder: 2,
    children: [
      { resourceId: '2-1', resourceCode: 'user', resourceName: '用户管理', resourceType: '菜单', parentId: '2', sortOrder: 1 },
      { resourceId: '2-2', resourceCode: 'user', resourceName: '新增', resourceType: '按钮', parentId: '2', sortOrder: 2 },
      { resourceId: '2-3', resourceCode: 'user', resourceName: '修改', resourceType: '按钮', parentId: '2', sortOrder: 3 },
      { resourceId: '2-4', resourceCode: 'user', resourceName: '删除', resourceType: '按钮', parentId: '2', sortOrder: 4 },
    ],
  },
  {
    resourceId: '3',
    resourceCode: 'model',
    resourceName: '模型管理',
    resourceType: '模块',
    sortOrder: 3,
    children: [
      { resourceId: '3-1', resourceCode: 'model', resourceName: '模型管理', resourceType: '菜单', parentId: '3', sortOrder: 1 },
      { resourceId: '3-2', resourceCode: 'model', resourceName: '新增', resourceType: '按钮', parentId: '3', sortOrder: 2 },
      { resourceId: '3-3', resourceCode: 'model', resourceName: '修改', resourceType: '按钮', parentId: '3', sortOrder: 3 },
      { resourceId: '3-4', resourceCode: 'model', resourceName: '删除', resourceType: '按钮', parentId: '3', sortOrder: 4 },
    ],
  },
]

const actions = [
  { label: '查看', value: 'read' },
  { label: '新增', value: 'write' },
  { label: '修改', value: 'update' },
  { label: '删除', value: 'delete' },
  { label: '管理', value: 'admin' },
]

export default function PermissionManagement() {
  const [roles, setRoles] = useState(mockRoles)
  const [modalOpen, setModalOpen] = useState(false)
  const [permDrawerOpen, setPermDrawerOpen] = useState(false)
  const [userDrawerOpen, setUserDrawerOpen] = useState(false)
  const [current, setCurrent] = useState<RoleItem | null>(null)
  const [form] = Form.useForm()

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
          <Button type="link" size="small" icon={<UserOutlined />} onClick={() => { setCurrent(record); setUserDrawerOpen(true) }}>用户管理</Button>
          {!record.isSystem && (
            <>
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(record); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>
              <Button type="link" size="small" icon={<CopyOutlined />} onClick={() => message.success('复制角色成功')}>复制</Button>
              <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}>
                <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ]

  const handleSubmit = async (values: { roleCode: string; roleName: string; description?: string; isEnabled: boolean }) => {
    try {
      message.success(current ? '修改成功' : '创建成功')
      setModalOpen(false)
      form.resetFields()
      setCurrent(null)
    } catch {
      message.error('操作失败')
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

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="roleId"
        scroll={{ x: 1200 }}
        pagination={{ showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
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
        <Typography.Paragraph type="secondary">为角色配置各模块的操作权限（允许/拒绝/未设置）</Typography.Paragraph>
        {mockResources.map((mod) => (
          <div key={mod.resourceId} style={{ marginBottom: 16 }}>
            <Title level={5}>{mod.resourceName}</Title>
            <Row gutter={[8, 8]}>
              {actions.map((a) => (
                <Col key={a.value} span={4}>
                  <Checkbox>{a.label}</Checkbox>
                </Col>
              ))}
            </Row>
            {mod.children?.map((child) => (
              <div key={child.resourceId} style={{ marginLeft: 24, marginTop: 8 }}>
                <Typography.Text strong>{child.resourceName}</Typography.Text>
                <Row gutter={[8, 8]} style={{ marginTop: 4 }}>
                  {actions.map((a) => (
                    <Col key={a.value} span={4}>
                      <Checkbox>{a.label}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
            <Divider style={{ margin: '12px 0' }} />
          </div>
        ))}
        <Button type="primary" onClick={() => { message.success('权限保存成功'); setPermDrawerOpen(false) }}>保存权限</Button>
      </Drawer>

      <Drawer
        title={`用户管理 - ${current?.roleName}`}
        open={userDrawerOpen}
        onClose={() => setUserDrawerOpen(false)}
        width={720}
      >
        <Typography.Paragraph type="secondary">管理已关联此角色的用户</Typography.Paragraph>
        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => message.info('批量添加用户')}>
          添加用户
        </Button>
        <Table
          columns={[
            { title: '用户名', dataIndex: 'username' },
            { title: '姓名', dataIndex: 'realName' },
            { title: '分配方式', dataIndex: 'assignType', render: (v) => <Tag>{v}</Tag> },
            { title: '分配时间', dataIndex: 'assignTime' },
            {
              title: '操作',
              key: 'action',
              render: () => <Popconfirm title="确定移除？" onConfirm={() => message.success('移除成功')}><Button type="link" size="small" danger>移除</Button></Popconfirm>,
            },
          ]}
          dataSource={[]}
          rowKey="userId"
          locale={{ emptyText: '暂无关联用户' }}
        />
      </Drawer>
    </div>
  )
}
