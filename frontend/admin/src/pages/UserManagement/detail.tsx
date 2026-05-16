import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Button, Space, Tag, message, Popconfirm, Modal, Form, Input, Select, Descriptions, Card } from 'antd'
import type { DescriptionsProps } from 'antd'
import {
  EditOutlined,
  SaveOutlined,
  DeleteOutlined,
  KeyOutlined,
  StopOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { getUserByNum, createUser, updateUser, deleteUser, enableUser, disableUser, resetUserPassword, checkUsername } from '../../api/user'
import type { UserListItem } from '../../types'

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

const FORM_LAYOUT = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
}

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
    source: (sourceMap[rawSource] || '手动创建') as any,
    status: rawStatus as any,
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

/* ========== 用户名唯一性校验（仅新增时校验） ========== */
const validateUsername = async (_: unknown, value: string) => {
  if (!value) return Promise.resolve()
  const res = await checkUsername(value)
  if (res.data.data) {
    return Promise.reject(new Error('用户名已存在'))
  }
  return Promise.resolve()
}

export default function UserDetail() {
  const navigate = useNavigate()
  const { num } = useParams<{ num: string }>()
  const location = useLocation()
  const isNew = num === 'new'

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<UserListItem | null>(null)
  const [editing, setEditing] = useState(false)
  const [form] = Form.useForm()
  const [resetModalOpen, setResetModalOpen] = useState(false)

  // 从列表进入详情时，保留列表的查询参数
  const listState = (location.state as { fromList?: boolean; search?: string } | null)
  const listBackUrl = listState?.fromList ? `/users?${listState.search || ''}` : '/users'

  // 加载用户详情（仅非新增时）
  useEffect(() => {
    if (!isNew && num) {
      loadDetail()
    }
  }, [num, isNew])

  // 切换编辑态时填充表单数据
  useEffect(() => {
    if (editing && user) {
      form.setFieldsValue({
        username: user.username,
        realName: user.realName,
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
        department: user.department,
        status: user.status,
        notes: user.notes,
      })
    }
  }, [editing, user])

  const loadDetail = async () => {
    if (!num) return
    setLoading(true)
    try {
      const res = await getUserByNum(num)
      const vo = res.data.data as unknown as Record<string, unknown>
      if (vo) {
        setUser(toUserListItem(vo))
      } else {
        message.error('用户不存在')
        navigate('/users')
      }
    } catch {
      message.error('加载用户详情失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (values: Record<string, unknown>) => {
    setSaving(true)
    try {
      if (isNew) {
        await createUser(values as any)
        message.success('创建成功')
        navigate(listBackUrl)
      } else {
        await updateUser({ ...values, id: user!.userId } as any)
        message.success('保存成功')
        setEditing(false)
        loadDetail()
      }
    } catch {
      // 请求失败
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!user?.num) return
    try {
      await deleteUser(user.num)
      message.success('删除成功')
      navigate(listBackUrl)
    } catch {
      message.error('删除失败')
    }
  }

  const handleEnable = async () => {
    if (!user?.num) return
    try {
      await enableUser(user.num)
      message.success('启用成功')
      loadDetail()
    } catch {
      message.error('启用失败')
    }
  }

  const handleDisable = async () => {
    if (!user?.num) return
    try {
      await disableUser(user.num)
      message.success('禁用成功')
      loadDetail()
    } catch {
      message.error('禁用失败')
    }
  }

  const handleResetPassword = async (values: Record<string, unknown>) => {
    if (!user?.num) return false
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return false
    }
    try {
      await resetUserPassword(user.num, String(values.newPassword || ''))
      message.success('密码重置成功')
      setResetModalOpen(false)
      return true
    } catch {
      message.error('密码重置失败')
      return false
    }
  }

  const isDraft = user?.status === 'DRAFT'
  const statusInfo = user ? statusMap[user.status] : null
  const pageTitle = isNew ? '新增用户' : (editing ? '编辑用户' : '用户详情')

  /* ========== 顶部操作按钮 ========== */
  const extraActions = isNew ? (
    <Space>
      <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
        创建
      </Button>
      <Button onClick={() => navigate(listBackUrl)}>取消</Button>
    </Space>
  ) : editing ? (
    <Space>
      <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
        保存
      </Button>
      <Button onClick={() => setEditing(false)}>取消</Button>
    </Space>
  ) : (
    <Space>
      <Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)}>编辑</Button>
      {!isDraft && (
        <>
          {user?.status === 'ENABLED' && (
            <Popconfirm title="确定禁用？" onConfirm={handleDisable}>
              <Button icon={<StopOutlined />}>禁用</Button>
            </Popconfirm>
          )}
          {user?.status === 'DISABLED' && (
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleEnable}>启用</Button>
          )}
          <Button icon={<KeyOutlined />} onClick={() => setResetModalOpen(true)}>重置密码</Button>
        </>
      )}
      {isDraft && (
        <Popconfirm title="确定删除？" onConfirm={handleDelete}>
          <Button danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      )}
    </Space>
  )

  /* ========== 基本信息（只读） ========== */
  const BaseInfoContent = () => {
    if (!user) return null
    const items: DescriptionsProps['items'] = [
      { key: 'username', label: '用户名', children: user.username },
      { key: 'realName', label: '姓名', children: user.realName },
      { key: 'nickname', label: '昵称', children: user.nickname || '-' },
      { key: 'email', label: '邮箱', children: user.email },
      { key: 'phone', label: '手机号', children: user.phone || '-' },
      { key: 'department', label: '部门', children: user.department || '-' },
      { key: 'status', label: '状态', children: <Tag color={statusInfo?.color}>{statusInfo?.text}</Tag> },
      { key: 'source', label: '来源', children: user.source },
      { key: 'mfa', label: 'MFA', children: <Tag color={user.mfaEnabled ? 'blue' : 'default'}>{user.mfaEnabled ? '已开启' : '未开启'}</Tag> },
      { key: 'notes', label: '备注', children: user.notes || '-', span: 2 },
    ]
    return <Descriptions column={2} items={items} size="small" />
  }

  /* ========== 基本信息（编辑/新增） ========== */
  const UserForm = () => (
    <Form
      {...FORM_LAYOUT}
      form={form}
      onFinish={handleSave}
      style={{ maxWidth: 'none' }}
      initialValues={{ status: isNew ? 'DRAFT' : undefined }}
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, max: 30, message: '3-30字符' },
          ...(isNew ? [{ validator: validateUsername }] : []),
        ]}
      >
        <Input placeholder="3-30字符" maxLength={64} disabled={!isNew} />
      </Form.Item>
      {isNew && (
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }, { min: 8, message: '密码至少8个字符' }]}
        >
          <Input.Password placeholder="8-32字符" maxLength={32} />
        </Form.Item>
      )}
      <Form.Item
        label="姓名"
        name="realName"
        rules={[{ required: true, message: '请输入姓名' }]}
      >
        <Input placeholder="2-50字符" maxLength={50} />
      </Form.Item>
      <Form.Item label="昵称" name="nickname">
        <Input placeholder="可选" maxLength={64} />
      </Form.Item>
      <Form.Item
        label="邮箱"
        name="email"
        rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效邮箱' }]}
      >
        <Input placeholder="邮箱地址" maxLength={128} />
      </Form.Item>
      <Form.Item label="手机号" name="phone">
        <Input placeholder="11位手机号" maxLength={20} />
      </Form.Item>
      <Form.Item label="部门" name="department">
        <Input placeholder="所属部门" maxLength={128} />
      </Form.Item>
      {!isNew && (
        <Form.Item label="状态" name="status">
          <Select
            options={[
              { label: '草稿', value: 'DRAFT' },
              { label: '启用', value: 'ENABLED' },
              { label: '禁用', value: 'DISABLED' },
              { label: '离职', value: 'RESIGNED' },
            ]}
          />
        </Form.Item>
      )}
      <Form.Item label="备注" name="notes">
        <Input.TextArea placeholder="可选" rows={3} maxLength={500} showCount />
      </Form.Item>
    </Form>
  )

  return (
    <PageContainer
      header={{
        title: pageTitle,
        subTitle: !isNew && user ? (
          <Tag color={statusInfo?.color} style={{ fontSize: 13 }}>{statusInfo?.text}</Tag>
        ) : null,
        breadcrumb: {
          items: [
            { title: '用户管理', link: listBackUrl },
            { title: isNew ? '新增用户' : user?.username || '用户详情' },
          ],
        },
        extra: extraActions,
      }}
      loading={loading}
    >
      {isNew ? (
        <Card bordered={false}>
          <UserForm />
        </Card>
      ) : editing ? (
        <UserForm />
      ) : (
        <BaseInfoContent />
      )}

      {/* 重置密码弹窗 */}
      <Modal
        title="重置密码"
        open={resetModalOpen}
        onCancel={() => setResetModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={handleResetPassword}
          style={{ maxWidth: 400 }}
        >
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[{ required: true, message: '请输入新密码' }, { min: 8, message: '密码至少8个字符' }]}
          >
            <Input.Password placeholder="8-32字符" maxLength={32} />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            rules={[{ required: true, message: '请再次输入密码' }]}
          >
            <Input.Password placeholder="再次输入密码" maxLength={32} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setResetModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">确认重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
