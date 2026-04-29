import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Space, Button } from 'antd'
import {
  DashboardOutlined,
  RobotOutlined,
  UserOutlined,
  SecurityScanOutlined,
  ShopOutlined,
  ApiOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CrownOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '../store/auth'
import { useAppStore } from '../store/app'
import type { MenuProps } from 'antd'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '首页' },
  { key: '/agents', icon: <RobotOutlined />, label: 'Agent管理' },
  { key: '/users', icon: <UserOutlined />, label: '用户管理' },
  { key: '/permissions', icon: <SecurityScanOutlined />, label: '权限管理' },
  { key: '/skills', icon: <ShopOutlined />, label: 'Skill商店' },
  { key: '/mcps', icon: <ApiOutlined />, label: 'MCP管理' },
  { key: '/models', icon: <BulbOutlined />, label: '模型管理' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统配置' },
]

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { collapsed, setCollapsed } = useAppStore()
  const { user, clearAuth } = useAuthStore()
  const [selectedKey, setSelectedKey] = useState(location.pathname)

  useEffect(() => {
    setSelectedKey(location.pathname)
  }, [location.pathname])

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/login', { replace: true })
  }

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: '个人信息' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: collapsed ? 14 : 18,
            fontWeight: 600,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <CrownOutlined style={{ marginRight: collapsed ? 0 : 8 }} />
          {!collapsed && 'GAgentManager'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 48, height: 48 }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }}>
                {user?.realName?.[0]}
              </Avatar>
              <span>{user?.realName || user?.username}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 280,
            background: '#f5f5f5',
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
