import { Button, Space, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import type { ModelItem } from '../../types'
import { getModels, deleteModel } from '../../api/model'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  ENABLED: { text: '已启用', color: 'green' },
  DISABLED: { text: '已禁用', color: 'default' },
  ERROR: { text: '异常', color: 'red' },
}

const CATEGORY_OPTIONS: Record<string, { text: string }> = {
  '文本模型': { text: '文本模型' },
  '视觉模型': { text: '视觉模型' },
  '语音模型': { text: '语音模型' },
  '全模态模型': { text: '全模态模型' },
}

const PROVIDER_OPTIONS: Record<string, { text: string }> = {
  'OpenAI': { text: 'OpenAI' },
  'Anthropic': { text: 'Anthropic' },
  'DeepSeek': { text: 'DeepSeek' },
  '阿里通义': { text: '阿里通义' },
  '百度文心': { text: '百度文心' },
  '智谱': { text: '智谱' },
  'Google': { text: 'Google' },
  'Meta': { text: 'Meta' },
  '本地部署': { text: '本地部署' },
  '其他': { text: '其他' },
}

const ellipsisStyle: React.CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

function toModelItem(vo: Record<string, unknown>): ModelItem {
  const capabilities = vo.capabilities ? String(vo.capabilities).split(',').filter(Boolean) : []
  const rawStatus = String(vo.status || 'ENABLED')
  const statusInfo = STATUS_MAP[rawStatus] || STATUS_MAP.ENABLED
  return {
    modelId: String(vo.id || ''),
    num: String(vo.num || ''),
    modelCode: String(vo.modelCode || ''),
    modelName: String(vo.modelName || ''),
    provider: (vo.provider as ModelItem['provider']) || '其他',
    apiType: (vo.apiType as ModelItem['apiType']) || 'OpenAI兼容',
    category: (vo.category as ModelItem['category']) || '文本模型',
    status: statusInfo.text as '已启用' | '已禁用' | '异常',
    _rawStatus: rawStatus,
    capabilities,
    boundAgentCount: 0,
    avgResponseTime: undefined,
    totalCalls: 0,
    todayCalls: 0,
    todayTokenCount: 0,
    createTime: vo.createTime ? new Date(vo.createTime as number).toLocaleString('zh-CN') : '',
    updater: String(vo.updateNo || ''),
    updateTime: vo.updateTime ? new Date(vo.updateTime as number).toLocaleString('zh-CN') : '',
  }
}

export default function ModelManagement() {
  const actionRef = useRef<ActionType>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [testingId, setTestingId] = useState<string | null>(null)

  const reload = () => { actionRef.current?.reload() }

  const columns: ProColumns<ModelItem>[] = [
    {
      title: '模型名称',
      dataIndex: 'modelName',
      width: 150,
      ellipsis: true,
      fieldProps: { style: ellipsisStyle },
    },
    {
      title: '模型编码',
      dataIndex: 'modelCode',
      width: 140,
      search: false,
      ellipsis: true,
      fieldProps: { style: ellipsisStyle },
    },
    {
      title: '提供商',
      dataIndex: 'provider',
      width: 110,
      valueEnum: PROVIDER_OPTIONS,
      ellipsis: true,
    },
    {
      title: 'API类型',
      dataIndex: 'apiType',
      width: 120,
      search: false,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'category',
      width: 110,
      valueEnum: CATEGORY_OPTIONS,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueEnum: {
        '已启用': { text: '已启用' },
        '已禁用': { text: '已禁用' },
        '异常': { text: '异常' },
      },
      render: (_, r) => {
        const info = STATUS_MAP[r._rawStatus || ''] || STATUS_MAP.ENABLED
        return <Tag color={info.color}>{info.text}</Tag>
      },
    },
    {
      title: 'Base URL',
      dataIndex: 'baseUrl',
      width: 250,
      search: false,
      ellipsis: true,
      render: (_, r) => <span title={r.baseUrl || ''} style={ellipsisStyle}>{r.baseUrl || '-'}</span>,
    },
    {
      title: '最大Token',
      dataIndex: 'maxTokens',
      width: 100,
      search: false,
      render: (_, r) => r.maxTokens ?? '-',
    },
    {
      title: '能力标签',
      dataIndex: 'capabilities',
      width: 200,
      search: false,
      render: (_, r) => (
        <span title={r.capabilities.join(', ')} style={ellipsisStyle}>
          {r.capabilities.map((c) => <Tag key={c} style={{ marginInlineEnd: 4 }}>{c}</Tag>)}
        </span>
      ),
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
      width: 160,
      fixed: 'right',
      search: false,
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/models/${r.num}`, { state: { fromList: true, search: searchParams.toString() } })}>详情</Button>
          {r.status === '已禁用' && (
            <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r)}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  const handleDelete = async (record: ModelItem) => {
    try {
      await deleteModel(record.num!)
      message.success('删除成功')
      reload()
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <ProTable<ModelItem>
      actionRef={actionRef}
      columns={columns}
      rowKey="num"
      scroll={{ x: 1600 }}
      search={{
        labelWidth: 'auto',
      }}
      request={async (params) => {
        const { modelName, provider, category, status, current, pageSize } = params
        const apiParams: Record<string, unknown> = {
          pageNo: current ?? 1,
          pageSize: pageSize ?? 10,
        }
        if (modelName) apiParams.keyword = modelName
        if (provider) apiParams.provider = provider
        if (category) apiParams.category = category
        if (status) {
          const statusMapReverse: Record<string, string> = { '已启用': 'ENABLED', '已禁用': 'DISABLED', '异常': 'ERROR' }
          apiParams.status = statusMapReverse[String(status)] || status
        }
        setSearchParams(apiParams as Record<string, string>, { replace: true })
        const res = await getModels(apiParams)
        const records = (res.data.data?.records as unknown as Record<string, unknown>[]) || []
        return {
          data: records.map((r) => toModelItem(r)),
          success: true,
          total: Number(res.data.data?.total || 0),
        }
      }}
      headerTitle="模型管理"
      toolBarRender={() => [
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => navigate('/models/new', { state: { fromList: true, search: searchParams.toString() } })}>
          新增模型
        </Button>,
      ]}
      pagination={{
        showSizeChanger: true,
        showTotal: (t) => `共 ${t} 条`,
      }}
    />
  )
}
