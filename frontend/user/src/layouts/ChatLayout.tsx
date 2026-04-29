import { Outlet } from 'react-router-dom'
import { Layout, Avatar, Dropdown, Space, Typography } from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useAuth } from '../hooks/useAuth'
import type { MenuProps } from 'antd'

const { Header, Content, Sider } = Layout
const { Text } = Typography

export default function ChatLayout() {
  const { user, logout } = useAuth()

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => { window.location.href = '/profile' },
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: logout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 24px',
        borderBottom: '1px solid #f0f0f0',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}>
        <Text strong style={{ fontSize: 18 }}>GAgentManager</Text>
        <Dropdown menu={{ items }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar size="small" icon={<UserOutlined />} src={user?.avatar} />
            <Text>{user?.nickName || '用户'}</Text>
          </Space>
        </Dropdown>
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
