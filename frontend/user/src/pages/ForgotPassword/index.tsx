import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Steps, message, Typography } from 'antd'
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { sendCaptcha, resetPassword } from '../../api/auth'
import './index.css'

const { Title, Text } = Typography

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()

  const handleSendCaptcha = async () => {
    const values = await form1.validateFields(['email'])
    setEmail(values.email)
    setLoading(true)
    try {
      await sendCaptcha(values.email)
      message.success('验证码已发送至您的邮箱')
      setCurrent(1)
    } catch {
      message.error('发送失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: { captcha: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }
    setLoading(true)
    try {
      await resetPassword({ email, captcha: values.captcha, newPassword: values.newPassword })
      message.success('密码重置成功')
      setCurrent(2)
    } catch {
      message.error('重置失败，请检查验证码')
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
                找回密码
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.8 }}>
                通过注册邮箱验证身份
                <br />
                重置您的账户密码
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
            <Title level={3} style={{ marginBottom: 24, fontWeight: 600 }}>找回密码</Title>
            <Steps
              current={current}
              style={{ marginBottom: 32 }}
              items={[
                { title: '验证邮箱' },
                { title: '重置密码' },
                { title: '完成' },
              ]}
            />
          </div>

          {current === 0 && (
            <Form form={form1} onFinish={handleSendCaptcha} size="large" layout="vertical">
              <Form.Item name="email" rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}>
                <Input
                  prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="请输入注册邮箱"
                  className="login-input"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block className="login-submit-btn">
                  发送验证码
                </Button>
              </Form.Item>
            </Form>
          )}

          {current === 1 && (
            <Form form={form2} onFinish={handleSubmit} size="large" layout="vertical">
              <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码' }]}>
                <Input
                  prefix={<SafetyOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="邮箱验证码"
                  className="login-input"
                />
              </Form.Item>
              <Form.Item name="newPassword" rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码至少6位' },
              ]}>
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="新密码"
                  className="login-input"
                />
              </Form.Item>
              <Form.Item name="confirmPassword" rules={[
                { required: true, message: '请确认新密码' },
              ]}>
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="确认新密码"
                  className="login-input"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block className="login-submit-btn">
                  重置密码
                </Button>
              </Form.Item>
            </Form>
          )}

          {current === 2 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <SafetyOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
              <Title level={4}>密码重置成功</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                请使用新密码重新登录
              </Text>
              <Link to="/login">
                <Button type="primary" block className="login-submit-btn">
                  返回登录
                </Button>
              </Link>
            </div>
          )}

          <div className="login-footer" style={{ marginTop: 16 }}>
            <Link to="/login" className="login-forgot-link" style={{ fontSize: 14 }}>
              返回登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
