import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { ProLayout } from '@ant-design/pro-layout'
import { Avatar, Dropdown, Space, message } from 'antd'
import {
  DashboardOutlined,
  RobotOutlined,
  UserOutlined,
  SecurityScanOutlined,
  ShopOutlined,
  ApiOutlined,
  SettingOutlined,
  LogoutOutlined,
  CrownOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '../store/auth'

const routeConfig = {
  routes: [
    { path: '/dashboard', name: '首页', icon: <DashboardOutlined /> },
    { path: '/agents', name: 'Agent管理', icon: <RobotOutlined /> },
    { path: '/users', name: '用户管理', icon: <UserOutlined /> },
    { path: '/permissions', name: '权限管理', icon: <SecurityScanOutlined /> },
    { path: '/skills', name: 'Skill商店', icon: <ShopOutlined /> },
    { path: '/mcps', name: 'MCP管理', icon: <ApiOutlined /> },
    { path: '/models', name: '模型管理', icon: <BulbOutlined /> },
    { path: '/settings', name: '系统配置', icon: <SettingOutlined /> },
  ],
}

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, clearAuth } = useAuthStore()
  const [pathname, setPathname] = useState(location.pathname)

  useEffect(() => {
    setPathname(location.pathname)
  }, [location.pathname])

  const handleLogout = () => {
    clearAuth()
    message.success('已退出登录')
    navigate('/login', { replace: true })
  }

  const avatarDropdownItems = useMemo(() => [
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
  ], [])

  return (
    <div style={{ height: '100vh' }}>
      <ProLayout
        route={routeConfig}
        location={{ pathname }}
        onMenuHeaderClick={() => navigate('/dashboard')}
        menuItemRender={(item: any, dom: any) => (
          <div
            onClick={() => {
              if (item.path) {
                navigate(item.path)
              }
            }}
          >
            {dom}
          </div>
        )}
        avatarProps={{
          src: user?.avatar,
          title: user?.realName || user?.username,
          render: (_props: any, dom: any) => (
            <Dropdown menu={{ items: avatarDropdownItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }}>
                  {user?.realName?.[0]}
                </Avatar>
                <span>{user?.realName || user?.username}</span>
              </Space>
            </Dropdown>
          ),
        }}
        pageTitleRender={() => 'GAgentManager'}
        logo={<CrownOutlined style={{ fontSize: 24, color: '#fff' }} />}
        title="GAgentManager"
        token={{
          header: {
            colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
          },
        }}
      >
        <Outlet />
      </ProLayout>
    </div>
  )
}
