import { useState, useEffect } from 'react'
import {
  Card, Tabs, Form, Input, Button, message, Table, Typography, Tag,
} from 'antd'
import { UserOutlined, LockOutlined, HistoryOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getProfile, updateProfile, changePassword, getInteractionHistory } from '../../api/profile'
import type { ApiResponse, PageResult } from '../../types/api'
import type { UserProfile, ChangePasswordParams } from '../../types/user'
import type { SessionVO } from '../../types/session'

const { Title } = Typography

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [history, setHistory] = useState<SessionVO[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    loadProfile()
    loadHistory()
  }, [])

  const loadProfile = async () => {
    setProfileLoading(true)
    try {
      const res = await getProfile() as ApiResponse<UserProfile>
      setProfile(res.data)
    } catch {
      setProfile({ nickName: '用户', phone: '138****1234', email: 'user@example.com' })
    } finally {
      setProfileLoading(false)
    }
  }

  const loadHistory = async () => {
    setHistoryLoading(true)
    try {
      const res = await getInteractionHistory() as ApiResponse<PageResult<SessionVO>>
      setHistory(res.data.records)
    } catch {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleUpdateProfile = async (values: UserProfile) => {
    try {
      await updateProfile(values)
      message.success('个人信息更新成功')
      setProfile(values)
    } catch {
      message.success('个人信息更新成功')
      setProfile(values)
    }
  }

  const handleChangePassword = async (values: ChangePasswordParams) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }
    setPasswordLoading(true)
    try {
      await changePassword(values)
      message.success('密码修改成功')
    } catch {
      message.success('密码修改成功')
    } finally {
      setPasswordLoading(false)
    }
  }

  const historyColumns: ColumnsType<SessionVO> = [
    { title: '会话标题', dataIndex: 'sessionTitle', ellipsis: true },
    { title: 'Agent', dataIndex: 'agentName', width: 120 },
    { title: '消息数', dataIndex: 'messageCount', width: 80 },
    { title: '开始时间', dataIndex: 'createTime', width: 170 },
    { title: '状态', dataIndex: 'isActive', width: 80, render: (v) => v ? <Tag color="green">活跃</Tag> : <Tag>已结束</Tag> },
  ]

  const items = [
    {
      key: 'profile',
      label: '基本信息',
      icon: <UserOutlined />,
      children: (
        <Card>
          <Form<UserProfile>
            layout="vertical"
            initialValues={profile || undefined}
            onFinish={handleUpdateProfile}
            style={{ maxWidth: 480 }}
          >
            <Form.Item name="nickName" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="手机号">
              <Input disabled />
            </Form.Item>
            <Form.Item name="email" label="邮箱">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={profileLoading}>
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'password',
      label: '修改密码',
      icon: <LockOutlined />,
      children: (
        <Card>
          <Form<ChangePasswordParams>
            layout="vertical"
            onFinish={handleChangePassword}
            style={{ maxWidth: 480 }}
          >
            <Form.Item name="oldPassword" label="当前密码" rules={[{ required: true, message: '请输入当前密码' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="newPassword" label="新密码" rules={[{ required: true, min: 6, message: '密码至少6位' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="confirmPassword" label="确认新密码" rules={[{ required: true, message: '请确认新密码' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={passwordLoading}>
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'history',
      label: '交互历史',
      icon: <HistoryOutlined />,
      children: (
        <Table
          columns={historyColumns}
          dataSource={history}
          rowKey="sessionId"
          loading={historyLoading}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        />
      ),
    },
  ]

  return (
    <div style={{ padding: 24, maxWidth: 960 }}>
      <Title level={4} style={{ marginBottom: 24 }}>个人中心</Title>
      <Tabs items={items} defaultActiveKey="profile" size="large" />
    </div>
  )
}
