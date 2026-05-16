import { Button, Space, Tag, message, Popconfirm, Rate } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, RocketOutlined, DownloadOutlined } from '@ant-design/icons'
import { ProTable, ModalForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import type { SkillItem, SkillStatus, SkillCategory } from '../../types'
import { getSkills, createSkill, updateSkill, deleteSkill, installSkill, uninstallSkill } from '../../api/skill'
import { useState } from 'react'

const statusMap: Record<SkillStatus, { text: string }> = {
  '未安装': { text: '未安装' },
  '已安装': { text: '已安装' },
  '有更新可用': { text: '有更新' },
}

const SKILL_CATEGORY_OPTIONS: Record<string, { text: string }> = {
  '数据处理': { text: '数据处理' },
  '工具调用': { text: '工具调用' },
  '内容生成': { text: '内容生成' },
  '搜索查询': { text: '搜索查询' },
  '系统集成': { text: '系统集成' },
  '自定义': { text: '自定义' },
}

const SKILL_STATUS_OPTIONS: Record<string, { text: string }> = {
  '未安装': { text: '未安装' },
  '已安装': { text: '已安装' },
  '有更新可用': { text: '有更新' },
}

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
  const [current, setCurrent] = useState<SkillItem | null>(null)

  const columns: ProColumns<SkillItem>[] = [
    {
      title: 'Skill名称',
      dataIndex: 'skillName',
      width: 150,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
      valueEnum: SKILL_CATEGORY_OPTIONS,
      render: (_, r) => <Tag>{r.category}</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: SKILL_STATUS_OPTIONS,
      render: (_, r) => <Tag color={r.status === '已安装' ? 'green' : r.status === '有更新可用' ? 'orange' : 'default'}>{statusMap[r.status].text}</Tag>,
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: 100,
      search: false,
    },
    {
      title: '作者',
      dataIndex: 'author',
      width: 80,
      search: false,
    },
    {
      title: '安装次数',
      dataIndex: 'installCount',
      width: 100,
      search: false,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      width: 120,
      search: false,
      render: (_, r) => <Rate disabled allowHalf defaultValue={r.rating} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      fixed: 'right',
      search: false,
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" onClick={() => message.info('详情开发中')}>详情</Button>
          {r.status === '未安装' && (
            <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => handleInstall(r)}>安装</Button>
          )}
          {r.status === '已安装' && (
            <Popconfirm title="确定卸载？" onConfirm={() => handleUninstall(r)}>
              <Button type="link" size="small" danger>卸载</Button>
            </Popconfirm>
          )}
          {r.status === '有更新可用' && (
            <Button type="link" size="small" icon={<RocketOutlined />} onClick={() => handleInstall(r)}>更新</Button>
          )}
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setCurrent(r) }}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r)}>
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
    } catch {
      message.error('安装失败')
    }
  }

  const handleUninstall = async (record: SkillItem) => {
    try {
      await uninstallSkill(record.num!)
      message.success('卸载成功')
    } catch {
      message.error('卸载失败')
    }
  }

  const handleDelete = async (record: SkillItem) => {
    try {
      await deleteSkill(record.num!)
      message.success('删除成功')
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <>
      <ProTable<SkillItem>
        columns={columns}
        rowKey="skillId"
        scroll={{ x: 1200 }}
        request={async (params) => {
          const res = await getSkills({
            pageNo: params.current ?? 1,
            pageSize: params.pageSize ?? 10,
            ...params,
          } as Record<string, unknown>)
          const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
          return {
            data: records.map(toSkillItem),
            success: true,
            total: Number(res.data.data?.total || 0),
          }
        }}
        headerTitle="Skill商店"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setCurrent(null) }}>
            新增Skill
          </Button>,
        ]}
        pagination={{
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
        }}
      />

      <ModalForm<{ skillName: string; description: string; category: string }>
        title={current ? '编辑Skill' : '新增Skill'}
        open={!!current}
        onOpenChange={(open) => { if (!open) setCurrent(null) }}
        onFinish={async (values) => {
          try {
            if (current?.skillId) {
              await updateSkill({ ...values, id: current.skillId })
              message.success('修改成功')
            } else {
              await createSkill(values)
              message.success('创建成功')
            }
            setCurrent(null)
            return true
          } catch {
            message.error('操作失败')
            return false
          }
        }}
      >
        <ProFormText name="skillName" label="Skill名称" rules={[{ required: true }]} placeholder="2-50字符" />
        <ProFormTextArea name="description" label="描述" rules={[{ required: true }]} />
        <ProFormSelect
          name="category"
          label="分类"
          rules={[{ required: true }]}
          options={[
            { label: '数据处理', value: '数据处理' },
            { label: '工具调用', value: '工具调用' },
            { label: '内容生成', value: '内容生成' },
            { label: '搜索查询', value: '搜索查询' },
            { label: '系统集成', value: '系统集成' },
            { label: '自定义', value: '自定义' },
          ]}
        />
      </ModalForm>
    </>
  )
}
