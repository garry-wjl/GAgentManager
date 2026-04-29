import { useState } from 'react'
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select, message,
  Popconfirm, Card, Row, Col, Typography, Rate, Drawer, Tabs, Badge,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, RocketOutlined, DownloadOutlined, HistoryOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { SkillItem, SkillStatus, SkillCategory } from '../../types'

const { Title, Text } = Typography

const statusMap: Record<SkillStatus, { text: string; color: string }> = {
  '未安装': { text: '未安装', color: 'default' },
  '已安装': { text: '已安装', color: 'green' },
  '有更新可用': { text: '有更新', color: 'orange' },
}

const mockData: SkillItem[] = [
  {
    skillId: '1',
    skillName: '代码助手',
    description: '提供代码补全、代码审查等功能',
    category: '工具调用',
    tags: ['代码', '开发'],
    version: 'V2.1.0',
    author: '官方',
    installCount: 1200,
    rating: 4.8,
    ratingCount: 86,
    status: '已安装',
    isOfficial: true,
    isFree: true,
    createTime: '2026-02-10 00:00:00',
    updater: '官方',
    updateTime: '2026-04-20 10:00:00',
  },
  {
    skillId: '2',
    skillName: '数据分析',
    description: '数据分析和可视化Skill',
    category: '数据处理',
    tags: ['数据', '可视化'],
    version: 'V1.0.0',
    author: '官方',
    installCount: 560,
    rating: 4.5,
    ratingCount: 32,
    status: '未安装',
    isOfficial: true,
    isFree: true,
    createTime: '2026-03-15 00:00:00',
    updater: '官方',
    updateTime: '2026-03-15 10:00:00',
  },
]

export default function SkillStore() {
  const [data, setData] = useState(mockData)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [current, setCurrent] = useState<SkillItem | null>(null)
  const [form] = Form.useForm()

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
            <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => message.success('安装成功')}>安装</Button>
          )}
          {record.status === '已安装' && (
            <Popconfirm title="确定卸载？" onConfirm={() => message.success('卸载成功')}>
              <Button type="link" size="small" danger>卸载</Button>
            </Popconfirm>
          )}
          {record.status === '有更新可用' && (
            <Button type="link" size="small" icon={<RocketOutlined />} onClick={() => message.success('更新成功')}>更新</Button>
          )}
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(record); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleSubmit = async (values: { skillName: string; description: string; category: string; tags?: string[] }) => {
    try {
      message.success(current ? '修改成功' : '创建成功')
      setModalOpen(false)
      form.resetFields()
      setCurrent(null)
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

      <Table
        columns={columns}
        dataSource={data}
        rowKey="skillId"
        scroll={{ x: 1200 }}
        pagination={{ showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
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
