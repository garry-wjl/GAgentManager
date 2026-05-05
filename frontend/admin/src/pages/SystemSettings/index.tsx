import { message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { ProCard, ProForm, ProFormDigit, ProFormSwitch } from '@ant-design/pro-components'
import { useEffect, useState } from 'react'
import { getSystemParams, updateSystemParams } from '../../api/system'

export default function SystemSettings() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [params, setParams] = useState<Record<string, unknown>>({})

  useEffect(() => {
    loadSystemParams()
  }, [])

  const loadSystemParams = async () => {
    setLoading(true)
    try {
      const res = await getSystemParams()
      setParams(res.data.data || {})
    } catch {
      // 静默失败
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (values: Record<string, unknown>) => {
    setSaving('保存中')
    try {
      await updateSystemParams(values as Record<string, string>)
      message.success('配置已保存')
    } catch {
      message.error('保存失败')
    } finally {
      setSaving(null)
    }
  }

  return (
    <ProCard title="系统配置" loading={loading}>
      <ProForm
        layout="vertical"
        submitter={{
          searchConfig: { submitText: '保存配置' },
          submitButtonProps: { icon: <SaveOutlined />, loading: !!saving },
        }}
        onFinish={handleSave}
        initialValues={params}
        style={{ maxWidth: 600 }}
      >
        <ProCard title="系统参数" bordered style={{ marginBottom: 24 }}>
          <ProFormDigit name="maxAgentsPerUser" label="每个用户最大Agent数量" min={1} max={1000} />
          <ProFormDigit name="maxConcurrentAgents" label="系统最大并发Agent数" min={1} max={10000} />
          <ProFormDigit name="maxUploadFileSize" label="最大上传文件大小（MB）" min={1} max={500} />
          <ProFormDigit name="sessionTimeout" label="会话超时时间（分钟）" min={5} max={480} />
          <ProFormDigit name="dataRetentionDays" label="数据保留天数" min={1} max={3650} />
        </ProCard>

        <ProCard title="密码策略" bordered style={{ marginBottom: 24 }}>
          <ProFormDigit name="passwordMinLength" label="密码最小长度" min={6} max={32} />
          <ProFormSwitch name="passwordRequireUpper" label="要求大写字母" />
          <ProFormSwitch name="passwordRequireLower" label="要求小写字母" />
          <ProFormSwitch name="passwordRequireNumber" label="要求数字" />
          <ProFormSwitch name="passwordRequireSpecial" label="要求特殊字符" />
          <ProFormDigit name="passwordExpireDays" label="密码过期天数（0表示不过期）" min={0} max={365} />
        </ProCard>

        <ProCard title="安全设置" bordered>
          <ProFormDigit name="maxLoginFailures" label="最大登录失败次数" min={1} max={20} />
          <ProFormDigit name="lockDuration" label="账号锁定时长（分钟）" min={5} max={1440} />
          <ProFormSwitch name="enableMfa" label="强制MFA双因素认证" />
          <ProFormSwitch name="enableSso" label="启用SSO单点登录" />
        </ProCard>
      </ProForm>
    </ProCard>
  )
}
