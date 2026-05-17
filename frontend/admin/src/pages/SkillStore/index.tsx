import { Button, Space, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, EyeOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import type { SkillItem } from '../../types'
import { getSkills, deleteSkill, installSkill, uninstallSkill } from '../../api/skill'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  NOT_INSTALLED: { text: '未安装', color: 'default' },
  INSTALLED: { text: '已安装', color: 'green' },
  DISABLED: { text: '已禁用', color: 'default' },
}

const CATEGORY_OPTIONS: Record<string, { text: string }> = {
  '数据处理': { text: '数据处理' },
  '工具调用': { text: '工具调用' },
  '内容生成': { text: '内容生成' },
  '搜索查询': { text: '搜索查询' },
  '系统集成': { text: '系统集成' },
  '自定义': { text: '自定义' },
}

const ellipsisStyle: React.CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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
  }
}

export default function SkillManagement() {
  const actionRef = useRef<ActionType>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const reload = () => { actionRef.current?.reload() }

  const columns: ProColumns<SkillItem>[] = [
    {
      title: 'Skill名称',
      dataIndex: 'skillName',
      width: 150,
      ellipsis: true,
      fieldProps: { style: ellipsisStyle },
    },
    {
      title: 'Skill编码',
      dataIndex: 'skillCode',
      width: 140,
      search: false,
      ellipsis: true,
      fieldProps: { style: ellipsisStyle },
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 110,
      valueEnum: CATEGORY_OPTIONS,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueEnum: {
        '未安装': { text: '未安装' },
        '已安装': { text: '已安装' },
        '已禁用': { text: '已禁用' },
      },
      render: (_, r) => {
        const info = STATUS_MAP[r._rawStatus || ''] || STATUS_MAP.NOT_INSTALLED
        return <Tag color={info.color}>{info.text}</Tag>
      },
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: 100,
      search: false,
      ellipsis: true,
    },
    {
      title: '作者',
      dataIndex: 'author',
      width: 100,
      search: false,
      ellipsis: true,
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
      render: (_, r) => r.rating > 0 ? `${r.rating.toFixed(1)} (${r.ratingCount})` : '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      search: false,
      ellipsis: true,
      render: (_, r) => <span title={r.description || ''} style={ellipsisStyle}>{r.description || '-'}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 170,
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      search: false,
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/skills/${r.num}`, { state: { fromList: true, search: searchParams.toString() } })}>详情</Button>
          {r._rawStatus === 'NOT_INSTALLED' && (
            <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => handleInstall(r)}>安装</Button>
          )}
          {r._rawStatus === 'INSTALLED' && (
            <Popconfirm title="确定卸载？" onConfirm={() => handleUninstall(r)}>
              <Button type="link" size="small" danger>卸载</Button>
            </Popconfirm>
          )}
          {r._rawStatus === 'DISABLED' && (
            <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r)}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  const handleInstall = async (record: SkillItem) => {
    try {
      await installSkill(record.num!)
      message.success('安装成功')
      reload()
    } catch {
      message.error('安装失败')
    }
  }

  const handleUninstall = async (record: SkillItem) => {
    try {
      await uninstallSkill(record.num!)
      message.success('卸载成功')
      reload()
    } catch {
      message.error('卸载失败')
    }
  }

  const handleDelete = async (record: SkillItem) => {
    try {
      await deleteSkill(record.num!)
      message.success('删除成功')
      reload()
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <ProTable<SkillItem>
      actionRef={actionRef}
      columns={columns}
      rowKey="num"
      scroll={{ x: 1600 }}
      search={{
        labelWidth: 'auto',
      }}
      request={async (params) => {
        const { skillName, category, status, current, pageSize } = params
        const apiParams: Record<string, unknown> = {
          pageNo: current ?? 1,
          pageSize: pageSize ?? 10,
        }
        if (skillName) apiParams.keyword = skillName
        if (category) apiParams.category = category
        if (status) {
          const statusMapReverse: Record<string, string> = { '未安装': 'NOT_INSTALLED', '已安装': 'INSTALLED', '已禁用': 'DISABLED' }
          apiParams.status = statusMapReverse[String(status)] || status
        }
        setSearchParams(apiParams as Record<string, string>, { replace: true })
        const res = await getSkills(apiParams)
        const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
        return {
          data: records.map(toSkillItem),
          success: true,
          total: Number(res.data.data?.total || 0),
        }
      }}
      headerTitle="Skill管理"
      toolBarRender={() => [
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => navigate('/skills/new', { state: { fromList: true, search: searchParams.toString() } })}>
          新增Skill
        </Button>,
      ]}
      pagination={{
        showSizeChanger: true,
        showTotal: (t) => `共 ${t} 条`,
      }}
    />
  )
}
