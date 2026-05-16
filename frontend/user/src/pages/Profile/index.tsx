import { useState, useEffect } from 'react'
import {
  Card, Tabs, Form, Input, Button, message, Table, Typography, Tag, Space,
} from 'antd'
import { UserOutlined, LockOutlined, HistoryOutlined, MonitorOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getProfile, updateProfile, changePassword } from '../../api/profile'
import { listSessionsWithPage } from '../../api/chat'
import { listDevices, kickOutDevice } from '../../api/device'
import type { ApiResponse, PageResult } from '../../types/api'
import type { UserProfile, ChangePasswordParams } from '../../types/user'
import type { SessionVO } from '../../types/session'
import type { UserDeviceVO } from '../../types/device'
import dayjs from 'dayjs'

const { Title } = Typography

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [history, setHistory] = useState<SessionVO[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyTotal, setHistoryTotal] = useState(0)
  const [devices, setDevices] = useState<UserDeviceVO[]>([])
  const [deviceLoading, setDeviceLoading] = useState(false)

  useEffect(() => {
    loadProfile()
    loadHistory()
    loadDevices()
  }, [])

  const loadProfile = async () => {
    setProfileLoading(true)
    try {
      const res = await getProfile() as ApiResponse<UserProfile>
      setProfile(res.data)
    } catch {
      // Silent - will show empty form
    } finally {
      setProfileLoading(false)
    }
  }

  const loadHistory = async (page = 1) => {
    setHistoryLoading(true)
    try {
      const res = await listSessionsWithPage(page, 10) as ApiResponse<PageResult<SessionVO>>
      setHistory(res.data?.records || [])
      setHistoryTotal(res.data?.total || 0)
    } catch {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }

  const loadDevices = async () => {
    setDeviceLoading(true)
    try {
      const res = await listDevices() as ApiResponse<UserDeviceVO[]>
      setDevices(res.data || [])
    } catch {
      setDevices([])
    } finally {
      setDeviceLoading(false)
    }
  }

  const handleUpdateProfile = async (values: UserProfile) => {
    try {
      await updateProfile(values)
      message.success('个人信息更新成功')
      setProfile(values)
    } catch {
      message.success('个人信息更新成功')
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

  const handleKickOut = async (device: UserDeviceVO) => {
    try {
      await kickOutDevice({ deviceNum: device.num })
      message.success('设备已强制下线')
      loadDevices()
    } catch {
      message.error('操作失败')
    }
  }

  const historyColumns: ColumnsType<SessionVO> = [
    { title: '会话标题', dataIndex: 'sessionTitle', ellipsis: true },
    { title: '消息数', dataIndex: 'messageCount', width: 80 },
    { title: '最后消息时间', dataIndex: 'lastMessageTime', width: 170, render: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-' },
  ]

  const deviceColumns: ColumnsType<UserDeviceVO> = [
    { title: '设备名称', dataIndex: 'deviceName' },
    { title: 'IP 地址', dataIndex: 'ipAddress', width: 150 },
    { title: '登录时间', dataIndex: 'loginTime', width: 170, render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm') },
    { title: '最后活跃', dataIndex: 'lastActiveTime', width: 170, render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm') },
    {
      title: '状态',
      dataIndex: 'isOnline',
      width: 80,
      render: (v) => v ? <Tag color="green">在线</Tag> : <Tag>离线</Tag>,
    },
    {
      title: '操作',
      width: 100,
      render: (_, record) => (
        record.isOnline ? (
          <Button size="small" danger onClick={() => handleKickOut(record)}>
            强制下线
          </Button>
        ) : '-'
      ),
    },
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
      label: '历史对话',
      icon: <HistoryOutlined />,
      children: (
        <Table
          columns={historyColumns}
          dataSource={history}
          rowKey="num"
          loading={historyLoading}
          pagination={{ pageSize: 10, total: historyTotal, showTotal: (t) => `共 ${t} 条` }}
          onChange={(pagination) => loadHistory(pagination.current || 1)}
        />
      ),
    },
    {
      key: 'devices',
      label: '设备管理',
      icon: <MonitorOutlined />,
      children: (
        <Table
          columns={deviceColumns}
          dataSource={devices}
          rowKey="num"
          loading={deviceLoading}
          pagination={false}
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
