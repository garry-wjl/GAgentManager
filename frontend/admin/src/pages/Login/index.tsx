import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, Card, Checkbox, message, Typography } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, MobileOutlined } from '@ant-design/icons'
import { useAuthStore } from '../../store/auth'
import { login } from '../../api/auth'

const { Title, Link } = Typography

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken, setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [loginFailCount, setLoginFailCount] = useState(0)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const onFinish = async (values: { loginAccount: string; password: string; rememberMe?: boolean }) => {
    setLoading(true)
    try {
      const { data } = await login(values)
      setToken(data.data.token)
      setUser(data.data.user)
      message.success('登录成功')
      navigate(from, { replace: true })
    } catch {
      setLoginFailCount((c) => c + 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{ width: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
        styles={{ body: { padding: '40px 32px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={3} style={{ marginBottom: 8 }}>GAgentManager</Title>
          <Typography.Text type="secondary">企业级Agent管理平台 · 管理端</Typography.Text>
        </div>

        <Form name="login" onFinish={onFinish} size="large" autoComplete="off">
          <Form.Item
            name="loginAccount"
            rules={[{ required: true, message: '请输入手机号或邮箱' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="手机号 / 邮箱"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                <Checkbox>记住登录</Checkbox>
              </Form.Item>
              <Link href="/forgot-password">忘记密码？</Link>
            </div>
          </Form.Item>

          {loginFailCount >= 3 && (
            <Form.Item
              name="captcha"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="图形验证码" />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
