import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, message, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuthStore } from '../../store/auth'
import { login } from '../../api/auth'
import type { ApiResponse } from '../../types/api'
import type { LoginResult } from '../../api/auth'
import './index.css'

const { Title, Text } = Typography

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken, setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/chat'

  const onFinish = async (values: { loginAccount: string; password: string }) => {
    setLoading(true)
    try {
      const res = await login(values) as ApiResponse<LoginResult>
      setToken(res.data.token)
      setUser(res.data.user)
      message.success('登录成功')
      navigate(from, { replace: true })
    } catch {
      message.error('登录失败，请检查账号密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-banner">
        <div className="login-banner-content">
          <div className="login-banner-bg" />
          <div className="login-banner-inner">
            <div className="login-banner-logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="4" width="40" height="40" rx="8" fill="rgba(255,255,255,0.2)" />
                <path d="M16 14L34 24L16 34V14Z" fill="white" />
              </svg>
              <span className="login-banner-title">GAgentManager</span>
            </div>
            <div className="login-banner-text">
              <Title level={2} style={{ color: '#fff', fontWeight: 600, marginBottom: 16 }}>
                企业级 Agent 管理平台
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.8 }}>
                统一管理企业 AI Agent、模型、Skill 与 MCP 服务
                <br />
                提供灵活的 Agent 生命周期管理与细粒度权限控制
              </Text>
            </div>
            <div className="login-banner-deco">
              <div className="deco-circle deco-1" />
              <div className="deco-circle deco-2" />
              <div className="deco-circle deco-3" />
              <div className="deco-dots">
                <span /><span /><span /><span /><span /><span />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-form-wrap">
        <div className="login-form-container">
          <div className="login-form-header">
            <Title level={3} style={{ marginBottom: 8, fontWeight: 600 }}>欢迎登录</Title>
            <Text type="secondary">请使用手机号或邮箱账号登录</Text>
          </div>

          <Form name="login" onFinish={onFinish} size="large" autoComplete="off" layout="vertical">
            <Form.Item
              name="loginAccount"
              rules={[{ required: true, message: '请输入手机号或邮箱' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="手机号 / 邮箱"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="密码"
                className="login-input"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="login-submit-btn"
              >
                登 录
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <Text type="secondary" style={{ fontSize: 12 }}>
              &copy; 2026 GAgentManager. All rights reserved.
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
