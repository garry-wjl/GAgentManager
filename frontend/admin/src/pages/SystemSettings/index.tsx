import { useState, useEffect } from 'react'
import {
  Form, Input, InputNumber, Switch, Button, message, Typography,
  Card, Space, Divider, Tabs, Row, Col,
} from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import type { SystemParams } from '../../types'

const { Title } = Typography

export default function SystemSettings() {
  const [generalForm] = Form.useForm<SystemParams>()
  const [passwordForm] = Form.useForm<SystemParams>()
  const [securityForm] = Form.useForm<SystemParams>()

  useEffect(() => {
    // Load current system params (mock data)
    const mockParams: Partial<SystemParams> = {
      maxAgentsPerUser: 50,
      maxConcurrentAgents: 1000,
      defaultModel: '',
      maxUploadFileSize: 50,
      sessionTimeout: 60,
      passwordMinLength: 8,
      passwordRequireUpper: true,
      passwordRequireLower: true,
      passwordRequireNumber: true,
      passwordRequireSpecial: true,
      passwordExpireDays: 90,
      maxLoginFailures: 5,
      lockDuration: 30,
      enableMfa: false,
      enableSso: false,
      dataRetentionDays: 365,
    }
    generalForm.setFieldsValue(mockParams)
    passwordForm.setFieldsValue(mockParams)
    securityForm.setFieldsValue(mockParams)
  }, [])

  const handleSave = (formName: string) => {
    message.success(`${formName} 配置已保存`)
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
        <Button type="primary" icon={<SaveOutlined />} onClick={() => handleSave('系统参数')}>
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
        <Button type="primary" icon={<SaveOutlined />} onClick={() => handleSave('密码策略')}>
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
        <Button type="primary" icon={<SaveOutlined />} onClick={() => handleSave('安全设置')}>
          保存配置
        </Button>
      </Form.Item>
    </Form>
  )

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>系统配置</Title>

      <Card>
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
