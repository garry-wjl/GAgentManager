import { useState, useEffect } from 'react'
import {
  Form, Input, InputNumber, Switch, Button, message, Typography,
  Card, Space, Divider, Tabs, Row, Col,
} from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import type { SystemParams } from '../../types'
import { getSystemParams, updateSystemParams } from '../../api/system'

const { Title } = Typography

export default function SystemSettings() {
  const [generalForm] = Form.useForm<SystemParams>()
  const [passwordForm] = Form.useForm<SystemParams>()
  const [securityForm] = Form.useForm<SystemParams>()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    loadSystemParams()
  }, [])

  const loadSystemParams = async () => {
    setLoading(true)
    try {
      const res = await getSystemParams()
      const params = res.data.data || {}
      generalForm.setFieldsValue(params)
      passwordForm.setFieldsValue(params)
      securityForm.setFieldsValue(params)
    } catch {
      // 静默失败
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formName: string, form: typeof generalForm) => {
    setSaving(formName)
    try {
      const values = form.getFieldsValue() as unknown as Record<string, string>
      await updateSystemParams(values)
      message.success(`${formName} 配置已保存`)
    } catch {
      message.error('保存失败')
    } finally {
      setSaving(null)
    }
  }

  const generalTab = (
    <Form form={generalForm} layout="vertical" style={{ maxWidth: 600 }}>
      <Form.Item name="maxAgentsPerUser" label="每个用户最大Agent数量">
        <InputNumber min={1} max={1000} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="maxConcurrentAgents" label="系统最大并发Agent数">
        <InputNumber min={1} max={10000} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="maxUploadFileSize" label="最大上传文件大小（MB）">
        <InputNumber min={1} max={500} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="sessionTimeout" label="会话超时时间（分钟）">
        <InputNumber min={5} max={480} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="dataRetentionDays" label="数据保留天数">
        <InputNumber min={1} max={3650} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" icon={<SaveOutlined />} loading={saving === '系统参数'} onClick={() => handleSave('系统参数', generalForm)}>
          保存配置
        </Button>
      </Form.Item>
    </Form>
  )

  const passwordTab = (
    <Form form={passwordForm} layout="vertical" style={{ maxWidth: 600 }}>
      <Form.Item name="passwordMinLength" label="密码最小长度">
        <InputNumber min={6} max={32} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="passwordRequireUpper" label="要求大写字母" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="passwordRequireLower" label="要求小写字母" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="passwordRequireNumber" label="要求数字" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="passwordRequireSpecial" label="要求特殊字符" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="passwordExpireDays" label="密码过期天数（0表示不过期）">
        <InputNumber min={0} max={365} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" icon={<SaveOutlined />} loading={saving === '密码策略'} onClick={() => handleSave('密码策略', passwordForm)}>
          保存配置
        </Button>
      </Form.Item>
    </Form>
  )

  const securityTab = (
    <Form form={securityForm} layout="vertical" style={{ maxWidth: 600 }}>
      <Form.Item name="maxLoginFailures" label="最大登录失败次数">
        <InputNumber min={1} max={20} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="lockDuration" label="账号锁定时长（分钟）">
        <InputNumber min={5} max={1440} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="enableMfa" label="强制MFA双因素认证" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="enableSso" label="启用SSO单点登录" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item>
        <Button type="primary" icon={<SaveOutlined />} loading={saving === '安全设置'} onClick={() => handleSave('安全设置', securityForm)}>
          保存配置
        </Button>
      </Form.Item>
    </Form>
  )

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>系统配置</Title>

      <Card loading={loading}>
        <Tabs
          defaultActiveKey="general"
          items={[
            { key: 'general', label: '系统参数', children: generalTab },
            { key: 'password', label: '密码策略', children: passwordTab },
            { key: 'security', label: '安全设置', children: securityTab },
          ]}
        />
      </Card>
    </div>
  )
}
