import { useState } from 'react'
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select, message,
  Popconfirm, Descriptions, Typography, InputNumber, DatePicker, Row, Col,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined, UserSwitchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UserListItem, UserFormValues, UserStatus, UserSource } from '../../types'

const { TextArea } = Input
const { Title } = Typography

const statusColor: Record<UserStatus, string> = {
  '已启用': 'green',
  '已禁用': 'red',
  '已离职': 'default',
  '已删除': 'default',
}

const mockData: UserListItem[] = [
  {
    userId: '1',
    username: 'admin',
    realName: '系统管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    source: '手动创建',
    status: '已启用',
    roleNames: ['超级管理员'],
    mfaEnabled: false,
    loginFailCount: 0,
    creator: 'system',
    createTime: '2026-01-01 00:00:00',
    updater: 'admin',
    updateTime: '2026-04-28 10:00:00',
  },
  {
    userId: '2',
    username: 'developer',
    realName: '张三',
    nickname: 'dev',
    email: 'dev@example.com',
    phone: '13900139000',
    source: '手动创建',
    status: '已启用',
    roleNames: ['开发者'],
    department: '研发部',
    mfaEnabled: true,
    lastLoginTime: '2026-04-28 09:30:00',
    loginFailCount: 0,
    creator: 'admin',
    createTime: '2026-03-15 14:00:00',
    updater: 'admin',
    updateTime: '2026-04-27 16:00:00',
  },
]

export default function UserManagement() {
  const [data, setData] = useState(mockData)
  const [modalOpen, setModalOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [current, setCurrent] = useState<UserListItem | null>(null)
  const [form] = Form.useForm()
  const [resetForm] = Form.useForm()

  const columns: ColumnsType<UserListItem> = [
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: '姓名', dataIndex: 'realName', width: 120 },
    { title: '邮箱', dataIndex: 'email', width: 180 },
    { title: '手机号', dataIndex: 'phone', width: 130 },
    {
      title: '角色',
      dataIndex: 'roleNames',
      width: 150,
      render: (roles: string[]) => roles.map((r) => <Tag key={r}>{r}</Tag>),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: UserStatus) => <Tag color={statusColor[v]}>{v}</Tag>,
    },
    { title: '来源', dataIndex: 'source', width: 100 },
    { title: '最近登录', dataIndex: 'lastLoginTime', width: 170 },
    { title: '创建时间', dataIndex: 'createTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(record); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>
          {record.status === '已启用' && (
            <Popconfirm title="确定禁用？" onConfirm={() => message.success('禁用成功')}>
              <Button type="link" size="small" danger>禁用</Button>
            </Popconfirm>
          )}
          {record.status === '已禁用' && (
            <Button type="link" size="small" onClick={() => message.success('启用成功')}>启用</Button>
          )}
          <Button type="link" size="small" icon={<KeyOutlined />} onClick={() => { setCurrent(record); setResetOpen(true) }}>重置密码</Button>
          <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleSubmit = async (values: UserFormValues) => {
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
        <Title level={4} style={{ margin: 0 }}>用户管理</Title>
        <Space>
          <Button icon={<UserSwitchOutlined />}>批量操作</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null); form.resetFields(); setModalOpen(true) }}>
            新增用户
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="userId"
        scroll={{ x: 1400 }}
        pagination={{ showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
      />

      <Modal
        title={current ? '编辑用户' : '新增用户'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        onOk={() => form.submit()}
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input placeholder="3-30字符" />
              </Form.Item>
            </Col>
            {!current && (
              <Col span={12}>
                <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                  <Input.Password placeholder="8-32字符" />
                </Form.Item>
              </Col>
            )}
            <Col span={12}>
              <Form.Item name="realName" label="姓名" rules={[{ required: true }]}>
                <Input placeholder="2-50字符" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="邮箱地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="手机号">
                <Input placeholder="11位手机号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department" label="部门">
                <Input placeholder="所属部门" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" initialValue="已启用">
                <Select options={[
                  { label: '已启用', value: '已启用' },
                  { label: '已禁用', value: '已禁用' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="备注">
            <TextArea rows={2} maxLength={500} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="重置密码"
        open={resetOpen}
        onCancel={() => { setResetOpen(false); resetForm.resetFields() }}
        onOk={() => { message.success('密码重置成功'); setResetOpen(false) }}
      >
        <Form form={resetForm} layout="vertical">
          <Form.Item name="newPassword" label="新密码" rules={[{ required: true }]}>
            <Input.Password placeholder="8-32字符" />
          </Form.Item>
          <Form.Item name="confirmNewPassword" label="确认密码" dependencies={['newPassword']} rules={[{ required: true }, ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) return Promise.resolve()
              return Promise.reject(new Error('两次输入的密码不一致'))
            },
          })]}>
            <Input.Password placeholder="再次输入密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
