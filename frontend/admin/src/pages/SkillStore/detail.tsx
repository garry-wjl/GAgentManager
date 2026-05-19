import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Button, Space, Tag, message, Popconfirm, Form, Input, Select, Descriptions, Card, Checkbox, Upload } from 'antd'
import type { DescriptionsProps, UploadFile } from 'antd'
import { EditOutlined, SaveOutlined, DeleteOutlined, PlayCircleOutlined, StopOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { getSkill, createSkill, updateSkill, deleteSkill, installSkill, uninstallSkill, uploadSkillPackage } from '../../api/skill'
import type { SkillItem, SkillFormValues } from '../../types'

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  NOT_INSTALLED: { text: '未安装', color: 'default' },
  INSTALLED: { text: '已安装', color: 'green' },
  DISABLED: { text: '已禁用', color: 'default' },
}

const CATEGORY_OPTIONS = [
  { label: '数据处理', value: '数据处理' },
  { label: '工具调用', value: '工具调用' },
  { label: '内容生成', value: '内容生成' },
  { label: '搜索查询', value: '搜索查询' },
  { label: '系统集成', value: '系统集成' },
  { label: '自定义', value: '自定义' },
]

const TAG_OPTIONS = [
  { label: '数据清洗', value: '数据清洗' },
  { label: '格式化', value: '格式化' },
  { label: '聚合', value: '聚合' },
  { label: 'HTTP请求', value: 'HTTP请求' },
  { label: 'API调用', value: 'API调用' },
  { label: '搜索', value: '搜索' },
  { label: '文本生成', value: '文本生成' },
  { label: '代码生成', value: '代码生成' },
]

const FORM_LAYOUT = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
}

function toSkillItem(vo: Record<string, unknown>): SkillItem {
  const tags = vo.tags ? String(vo.tags).split(',').filter(Boolean) : []
  const rawStatus = String(vo.status || 'NOT_INSTALLED')
  const statusInfo = STATUS_MAP[rawStatus] || STATUS_MAP.NOT_INSTALLED
  return {
    skillId: String(vo.id || ''),
    num: String(vo.num || ''),
    skillCode: String(vo.skillCode || ''),
    skillName: String(vo.skillName || ''),
    description: String(vo.description || ''),
    icon: String(vo.icon || ''),
    category: (vo.category as SkillItem['category']) || '自定义',
    tags,
    version: String(vo.version || ''),
    author: String(vo.author || ''),
    installCount: Number(vo.installCount || 0),
    rating: Number(vo.rating || 0),
    ratingCount: Number(vo.ratingCount || 0),
    status: statusInfo.text as '未安装' | '已安装' | '已禁用',
    _rawStatus: rawStatus,
    isOfficial: Boolean(vo.isOfficial),
    isFree: Boolean(vo.isFree),
    createTime: vo.createTime ? new Date(vo.createTime as number).toLocaleString('zh-CN') : '',
    updater: String(vo.updateNo || ''),
    updateTime: vo.updateTime ? new Date(vo.updateTime as number).toLocaleString('zh-CN') : '',
    packageUrl: String(vo.packageUrl || ''),
  }
}

export default function SkillDetail() {
  const navigate = useNavigate()
  const { num } = useParams<{ num: string }>()
  const location = useLocation()
  const isNew = num === 'new'

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [skill, setSkill] = useState<SkillItem | null>(null)
  const [editing, setEditing] = useState(false)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const listState = (location.state as { fromList?: boolean; search?: string } | null)
  const listBackUrl = listState?.fromList ? `/skills?${listState.search || ''}` : '/skills'

  useEffect(() => {
    if (!isNew && num) {
      loadDetail()
    }
  }, [num, isNew])

  useEffect(() => {
    if (editing && skill) {
      form.setFieldsValue({
        skillName: skill.skillName,
        skillCode: skill.skillCode,
        category: skill.category,
        description: skill.description,
        author: skill.author,
        tags: skill.tags,
        isFree: skill.isFree,
      })
    }
  }, [editing, skill])

  const loadDetail = async () => {
    if (!num) return
    setLoading(true)
    try {
      const res = await getSkill(num)
      const vo = res.data.data as unknown as Record<string, unknown>
      if (vo) {
        setSkill(toSkillItem(vo))
      } else {
        message.error('Skill不存在')
        navigate('/skills')
      }
    } catch {
      message.error('加载Skill详情失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (values: Record<string, unknown>) => {
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        skillName: values.skillName,
        description: values.description,
        category: values.category,
        author: values.author,
        tags: values.tags,
        isFree: values.isFree,
      }
      if (isNew) {
        await createSkill({ ...payload, skillCode: values.skillCode } as any)
        message.success('创建成功')
        navigate(listBackUrl)
      } else {
        await updateSkill({ ...payload, id: skill!.skillId } as any)
        message.success('保存成功')
        setEditing(false)
        loadDetail()
      }
    } catch {
      // 请求失败
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!skill?.num) return
    try {
      await deleteSkill(skill.num)
      message.success('删除成功')
      navigate(listBackUrl)
    } catch {
      message.error('删除失败')
    }
  }

  const handleInstall = async () => {
    if (!skill?.num) return
    try {
      await installSkill(skill.num)
      message.success('安装成功')
      loadDetail()
    } catch {
      message.error('安装失败')
    }
  }

  const handleUninstall = async () => {
    if (!skill?.num) return
    try {
      await uninstallSkill(skill.num)
      message.success('卸载成功')
      loadDetail()
    } catch {
      message.error('卸载失败')
    }
  }

  const handleUploadPackage = async (file: File) => {
    if (!skill?.num && !isNew) return
    setUploading(true)
    try {
      const targetNum = isNew ? undefined : skill.num
      if (!targetNum) {
        message.error('请先创建Skill后再上传包文件')
        return
      }
      const res = await uploadSkillPackage(targetNum, file)
      const vo = res.data.data as unknown as Record<string, unknown>
      if (vo) {
        setSkill(toSkillItem(vo))
        message.success('Skill包上传成功')
      }
    } catch {
      message.error('Skill包上传失败')
    } finally {
      setUploading(false)
    }
    return false // Prevent default upload behavior
  }

  const statusInfo = skill ? STATUS_MAP[skill._rawStatus || ''] || STATUS_MAP.NOT_INSTALLED : null
  const pageTitle = isNew ? '新增Skill' : (editing ? '编辑Skill' : 'Skill详情')

  const extraActions = isNew ? (
    <Space>
      <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>创建</Button>
      <Button onClick={() => navigate(listBackUrl)}>取消</Button>
    </Space>
  ) : editing ? (
    <Space>
      <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>保存</Button>
      <Button onClick={() => setEditing(false)}>取消</Button>
    </Space>
  ) : (
    <Space>
      <Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)}>编辑</Button>
      {skill?.status === '已安装' && (
        <Popconfirm title="确定卸载？" onConfirm={handleUninstall}>
          <Button>卸载</Button>
        </Popconfirm>
      )}
      {skill?.status === '未安装' && (
        <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleInstall}>安装</Button>
      )}
      {skill?.status === '已禁用' && (
        <Popconfirm title="确定删除？" onConfirm={handleDelete}>
          <Button danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      )}
    </Space>
  )

  const BaseInfoContent = () => {
    if (!skill) return null
    const items: DescriptionsProps['items'] = [
      { key: 'skillName', label: 'Skill名称', children: skill.skillName },
      { key: 'skillCode', label: 'Skill编码', children: skill.skillCode },
      { key: 'category', label: '分类', children: skill.category },
      { key: 'version', label: '版本', children: skill.version || '-' },
      { key: 'author', label: '作者', children: skill.author || '-' },
      { key: 'status', label: '状态', children: <Tag color={statusInfo?.color}>{statusInfo?.text}</Tag> },
      { key: 'installCount', label: '安装次数', children: skill.installCount },
      { key: 'rating', label: '评分', children: skill.rating > 0 ? `${skill.rating.toFixed(1)} (${skill.ratingCount}人评价)` : '暂无评分' },
      { key: 'isOfficial', label: '官方', children: skill.isOfficial ? '是' : '否' },
      { key: 'isFree', label: '免费', children: skill.isFree ? '是' : '否' },
      { key: 'tags', label: '标签', children: skill.tags && skill.tags.length > 0 ? skill.tags.map((t) => <Tag key={t} style={{ marginInlineEnd: 4 }}>{t}</Tag>) : '-' },
      { key: 'description', label: '描述', children: skill.description || '-', span: 2 },
      { key: 'packageUrl', label: 'Skill包', children: skill.packageUrl ? (
        <a href={skill.packageUrl} target="_blank" rel="noopener noreferrer"><DownloadOutlined /> 下载Skill包</a>
      ) : '-' },
      { key: 'createTime', label: '创建时间', children: skill.createTime },
      { key: 'updater', label: '更新人', children: skill.updater },
    ]
    return <Descriptions column={2} items={items} size="small" bordered />
  }

  const SkillForm = () => (
    <Card bordered={false}>
      <Form
        {...FORM_LAYOUT}
        form={form}
        onFinish={handleSave}
        style={{ maxWidth: 'none' }}
        initialValues={{ category: '自定义', isFree: true }}
      >
        <Form.Item label="Skill名称" name="skillName" rules={[{ required: true, message: '请输入Skill名称' }]}>
          <Input placeholder="2-50字符" maxLength={50} />
        </Form.Item>
        {isNew && (
          <Form.Item label="Skill编码" name="skillCode" rules={[{ required: true, message: '请输入Skill编码' }]}>
            <Input placeholder="SKILL_CODE" maxLength={50} />
          </Form.Item>
        )}
        <Form.Item label="分类" name="category" rules={[{ required: true, message: '请选择分类' }]}>
          <Select options={CATEGORY_OPTIONS} />
        </Form.Item>
        <Form.Item label="作者" name="author">
          <Input placeholder="可选" maxLength={50} />
        </Form.Item>
        <Form.Item label="是否免费" name="isFree" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item label="标签" name="tags">
          <Checkbox.Group options={TAG_OPTIONS} />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea placeholder="可选" rows={3} maxLength={500} showCount />
        </Form.Item>
      </Form>
      {!isNew && skill && (
        <div style={{ marginTop: 24 }}>
          <h4>Skill包上传</h4>
          <Upload.Dragger
            accept=".zip"
            maxCount={1}
            fileList={fileList}
            beforeUpload={handleUploadPackage}
            onRemove={() => setFileList([])}
            disabled={uploading}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽 .zip 文件到此区域上传</p>
            <p className="ant-upload-hint">仅支持 .zip 格式的 Skill 包文件</p>
          </Upload.Dragger>
          {skill.packageUrl && (
            <div style={{ marginTop: 12 }}>
              当前包文件：<a href={skill.packageUrl} target="_blank" rel="noopener noreferrer"><DownloadOutlined /> 下载</a>
            </div>
          )}
        </div>
      )}
    </Card>
  )

  return (
    <PageContainer
      header={{
        title: pageTitle,
        subTitle: !isNew && skill ? (
          <Tag color={statusInfo?.color} style={{ fontSize: 13 }}>{statusInfo?.text}</Tag>
        ) : null,
        breadcrumb: {
          items: [
            { title: 'Skill管理', link: listBackUrl },
            { title: isNew ? '新增Skill' : skill?.skillName || 'Skill详情' },
          ],
        },
        extra: extraActions,
      }}
      loading={loading}
    >
      {isNew ? (
        <SkillForm />
      ) : editing ? (
        <SkillForm />
      ) : (
        <BaseInfoContent />
      )}
    </PageContainer>
  )
}
