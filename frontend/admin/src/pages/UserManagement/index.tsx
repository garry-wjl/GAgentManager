import { useState, useEffect } from 'react'
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select, message,
  Popconfirm, Descriptions, Typography, InputNumber, DatePicker, Row, Col,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined, UserSwitchOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UserListItem, UserFormValues, UserStatus, UserSource } from '../../types'
import { getUsers, createUser, updateUser, deleteUser, enableUser, disableUser, resignUser, resetUserPassword } from '../../api/user'

const { TextArea } = Input
const { Title } = Typography

const statusColor: Record<UserStatus, string> = {
  '已启用': 'green',
  '已禁用': 'red',
  '已离职': 'default',
  '已删除': 'default',
}

const USER_STATUS_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '已启用', value: '已启用' },
  { label: '已禁用', value: '已禁用' },
  { label: '已离职', value: '已离职' },
]

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
  const [data, setData] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [current, setCurrent] = useState<UserListItem | null>(null)
  const [form] = Form.useForm()
  const [resetForm] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({ keyword: '', status: '' })

  useEffect(() => {
    loadData()
  }, [pagination.current, pagination.pageSize])

  const loadData = async (overrideFilters?: Record<string, string>) => {
    setLoading(true)
    try {
      const activeFilters = overrideFilters ?? filters
      const params: Record<string, unknown> = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      }
      if (activeFilters.keyword) params.keyword = activeFilters.keyword
      if (activeFilters.status) params.status = activeFilters.status

      const res = await getUsers(params)
      const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
      setData(records.map(toUserListItem))
      setPagination(p => ({ ...p, total: Number(res.data.data?.total || 0) }))
    } catch {
      message.error('加载用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, keyword: value }
    setFilters(newFilters)
    setPagination(p => ({ ...p, current: 1 }))
    loadData(newFilters)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setPagination(p => ({ ...p, current: 1 }))
    loadData(newFilters)
  }

  const handleReset = () => {
    setFilters({ keyword: '', status: '' })
    setPagination(p => ({ ...p, current: 1 }))
    loadData({ keyword: '', status: '' })
  }

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
            <Popconfirm title="确定禁用？" onConfirm={() => handleDisable(record)}>
              <Button type="link" size="small" danger>禁用</Button>
            </Popconfirm>
          )}
          {record.status === '已禁用' && (
            <Button type="link" size="small" onClick={() => handleEnable(record)}>启用</Button>
          )}
          <Button type="link" size="small" icon={<KeyOutlined />} onClick={() => { setCurrent(record); setResetOpen(true) }}>重置密码</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleSubmit = async (values: UserFormValues) => {
    try {
      if (current) {
        await updateUser({ ...values, id: current.userId })
        message.success('修改成功')
      } else {
        await createUser(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      setCurrent(null)
      loadData()
    } catch {
      message.error('操作失败')
    }
  }

  const handleEnable = async (record: UserListItem) => {
    try {
      await enableUser(record.num!)
      message.success('启用成功')
      loadData()
    } catch {
      message.error('启用失败')
    }
  }

  const handleDisable = async (record: UserListItem) => {
    try {
      await disableUser(record.num!)
      message.success('禁用成功')
      loadData()
    } catch {
      message.error('禁用失败')
    }
  }

  const handleDelete = async (record: UserListItem) => {
    try {
      await deleteUser(record.num!)
      message.success('删除成功')
      loadData()
    } catch {
      message.error('删除失败')
    }
  }

  const handleResetPassword = async (values: { newPassword: string; confirmNewPassword: string }) => {
    try {
      await resetUserPassword(current!.num!, values.newPassword)
      message.success('密码重置成功')
      setResetOpen(false)
      resetForm.resetFields()
    } catch {
      message.error('密码重置失败')
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

      {/* 搜索/筛选栏 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={10}>
          <Input.Search
            placeholder="搜索用户名/姓名"
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
            placeholder="状态筛选"
            value={filters.status || undefined}
            onChange={(v) => handleFilterChange('status', v)}
            options={USER_STATUS_OPTIONS}
            allowClear
          />
        </Col>
        <Col xs={12} sm={9} style={{ textAlign: 'right' }}>
          <Button onClick={handleReset}>重置</Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="userId"
        loading={loading}
        scroll={{ x: 1400 }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (page, size) => { setPagination({ current: page, pageSize: size, total: pagination.total }); loadData() },
        }}
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
                <Input placeholder="3-30字符" disabled={!!current} />
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
        onOk={() => resetForm.submit()}
      >
        <Form form={resetForm} layout="vertical" onFinish={handleResetPassword}>
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
