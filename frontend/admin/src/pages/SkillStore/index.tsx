import { useState, useEffect } from 'react'
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select, message,
  Popconfirm, Card, Row, Col, Typography, Rate, Drawer, Tabs, Badge,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, RocketOutlined, DownloadOutlined, HistoryOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { SkillItem, SkillStatus, SkillCategory } from '../../types'
import { getSkills, createSkill, updateSkill, deleteSkill, installSkill, uninstallSkill } from '../../api/skill'

const { Title, Text } = Typography

const statusMap: Record<SkillStatus, { text: string; color: string }> = {
  '未安装': { text: '未安装', color: 'default' },
  '已安装': { text: '已安装', color: 'green' },
  '有更新可用': { text: '有更新', color: 'orange' },
}

const SKILL_CATEGORY_OPTIONS = [
  { label: '全部分类', value: '' },
  { label: '数据处理', value: '数据处理' },
  { label: '工具调用', value: '工具调用' },
  { label: '内容生成', value: '内容生成' },
  { label: '搜索查询', value: '搜索查询' },
  { label: '系统集成', value: '系统集成' },
  { label: '自定义', value: '自定义' },
]

const SKILL_STATUS_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '未安装', value: '未安装' },
  { label: '已安装', value: '已安装' },
  { label: '有更新可用', value: '有更新可用' },
]

/** 将后端 SkillVO 转换为前端 SkillItem */
function toSkillItem(vo: Record<string, unknown>): SkillItem {
  const tags = vo.tags ? String(vo.tags).split(',').filter(Boolean) : []
  return {
    skillId: String(vo.id || ''),
    num: String(vo.num || ''),
    skillName: String(vo.skillName || ''),
    description: String(vo.description || ''),
    category: (vo.category as SkillCategory) || '自定义',
    tags,
    version: String(vo.version || ''),
    author: String(vo.author || ''),
    installCount: Number(vo.installCount || 0),
    rating: Number(vo.rating || 0),
    ratingCount: Number(vo.ratingCount || 0),
    status: (vo.status as SkillStatus) || '未安装',
    isOfficial: Boolean(vo.isOfficial),
    isFree: Boolean(vo.isFree),
    createTime: String(vo.createTime || ''),
    updater: String(vo.updateNo || ''),
    updateTime: String(vo.updateTime || ''),
  }
}

export default function SkillStore() {
  const [data, setData] = useState<SkillItem[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [current, setCurrent] = useState<SkillItem | null>(null)
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({ keyword: '', category: '', status: '' })

  useEffect(() => {
    loadData()
  }, [pagination.current, pagination.pageSize])

  const loadData = async (overrideFilters?: Record<string, string>) => {
    setLoading(true)
    try {
      const activeFilters = overrideFilters ?? filters
      const params: Record<string, unknown> = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      }
      if (activeFilters.keyword) params.keyword = activeFilters.keyword
      if (activeFilters.category) params.category = activeFilters.category
      if (activeFilters.status) params.status = activeFilters.status

      const res = await getSkills(params)
      const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
      setData(records.map(toSkillItem))
      setPagination(p => ({ ...p, total: Number(res.data.data?.total || 0) }))
    } catch {
      message.error('加载Skill列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, keyword: value }
    setFilters(newFilters)
    setPagination(p => ({ ...p, current: 1 }))
    loadData(newFilters)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setPagination(p => ({ ...p, current: 1 }))
    loadData(newFilters)
  }

  const handleReset = () => {
    setFilters({ keyword: '', category: '', status: '' })
    setPagination(p => ({ ...p, current: 1 }))
    loadData({ keyword: '', category: '', status: '' })
  }

  const columns: ColumnsType<SkillItem> = [
    { title: 'Skill名称', dataIndex: 'skillName', width: 150 },
    { title: '分类', dataIndex: 'category', width: 100, render: (v) => <Tag>{v}</Tag> },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: SkillStatus) => <Tag color={statusMap[v].color}>{statusMap[v].text}</Tag>,
    },
    { title: '版本', dataIndex: 'version', width: 100 },
    { title: '作者', dataIndex: 'author', width: 80 },
    { title: '安装次数', dataIndex: 'installCount', width: 100 },
    {
      title: '评分',
      dataIndex: 'rating',
      width: 120,
      render: (v: number) => <Rate disabled allowHalf defaultValue={v} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => { setCurrent(record); setDetailOpen(true) }}>详情</Button>
          {record.status === '未安装' && (
            <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => handleInstall(record)}>安装</Button>
          )}
          {record.status === '已安装' && (
            <Popconfirm title="确定卸载？" onConfirm={() => handleUninstall(record)}>
              <Button type="link" size="small" danger>卸载</Button>
            </Popconfirm>
          )}
          {record.status === '有更新可用' && (
            <Button type="link" size="small" icon={<RocketOutlined />} onClick={() => handleInstall(record)}>更新</Button>
          )}
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(record); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleInstall = async (record: SkillItem) => {
    try {
      await installSkill(record.num!)
      message.success('安装成功')
      loadData()
    } catch {
      message.error('安装失败')
    }
  }

  const handleUninstall = async (record: SkillItem) => {
    try {
      await uninstallSkill(record.num!)
      message.success('卸载成功')
      loadData()
    } catch {
      message.error('卸载失败')
    }
  }

  const handleDelete = async (record: SkillItem) => {
    try {
      await deleteSkill(record.num!)
      message.success('删除成功')
      loadData()
    } catch {
      message.error('删除失败')
    }
  }

  const handleSubmit = async (values: { skillName: string; description: string; category: string; tags?: string[] }) => {
    try {
      if (current) {
        await updateSkill({ ...values, id: current.skillId })
        message.success('修改成功')
      } else {
        await createSkill(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      setCurrent(null)
      loadData()
    } catch {
      message.error('操作失败')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Skill商店</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null); form.resetFields(); setModalOpen(true) }}>
          新增Skill
        </Button>
      </div>

      {/* 搜索/筛选栏 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Input.Search
            placeholder="搜索 Skill 名称"
            allowClear
            enterButton={<SearchOutlined />}
            value={filters.keyword}
            onChange={(e) => setFilters(f => ({ ...f, keyword: e.target.value }))}
            onSearch={handleSearch}
          />
        </Col>
        <Col xs={12} sm={5}>
          <Select
            style={{ width: '100%' }}
            placeholder="分类筛选"
            value={filters.category || undefined}
            onChange={(v) => handleFilterChange('category', v)}
            options={SKILL_CATEGORY_OPTIONS}
            allowClear
          />
        </Col>
        <Col xs={12} sm={5}>
          <Select
            style={{ width: '100%' }}
            placeholder="状态筛选"
            value={filters.status || undefined}
            onChange={(v) => handleFilterChange('status', v)}
            options={SKILL_STATUS_OPTIONS}
            allowClear
          />
        </Col>
        <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
          <Button onClick={handleReset}>重置</Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="skillId"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (page, size) => { setPagination({ current: page, pageSize: size, total: pagination.total }); loadData() },
        }}
      />

      <Modal
        title={current ? '编辑Skill' : '新增Skill'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="skillName" label="Skill名称" rules={[{ required: true }]}>
            <Input placeholder="2-50字符" />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true }]}>
            <Input.TextArea rows={3} maxLength={500} showCount />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select options={[
              { label: '数据处理', value: '数据处理' },
              { label: '工具调用', value: '工具调用' },
              { label: '内容生成', value: '内容生成' },
              { label: '搜索查询', value: '搜索查询' },
              { label: '系统集成', value: '系统集成' },
              { label: '自定义', value: '自定义' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={current?.skillName}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        width={720}
      >
        {current && (
          <>
            <Card>
              <Row gutter={[16, 16]}>
                <Col span={8}><Text strong>版本：</Text>{current.version}</Col>
                <Col span={8}><Text strong>作者：</Text>{current.author}</Col>
                <Col span={8}>
                  <Text strong>状态：</Text>
                  <Badge status={current.status === '已安装' ? 'success' : current.status === '未安装' ? 'default' : 'warning'} text={statusMap[current.status].text} />
                </Col>
                <Col span={8}><Text strong>安装次数：</Text>{current.installCount}</Col>
                <Col span={8}><Text strong>评分：</Text><Rate disabled allowHalf defaultValue={current.rating} /> ({current.rating})</Col>
                <Col span={8}><Text strong>官方：</Text>{current.isOfficial ? '是' : '否'}</Col>
              </Row>
              <Typography.Paragraph style={{ marginTop: 16 }}>
                <Text strong>描述：</Text>{current.description}
              </Typography.Paragraph>
            </Card>
            <Tabs
              style={{ marginTop: 16 }}
              items={[
                { key: 'version', label: '版本历史', children: <p><HistoryOutlined /> 版本记录</p> },
                { key: 'config', label: '配置', children: <p>Skill配置参数</p> },
              ]}
            />
          </>
        )}
      </Drawer>
    </div>
  )
}
