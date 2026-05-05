import type { ProColumns } from '@ant-design/pro-components'

/** ProTable 请求返回类型 */
export interface ProTableResponse<T> {
  data: T[]
  success: boolean
  total: number
}

/** 后端分页参数 */
export interface BackendPageParam {
  pageNo: number
  pageSize: number
  [key: string]: unknown
}

/** 将 ProTable 请求参数转换为后端分页请求，并返回格式化结果 */
export async function requestPage<T>(
  params: { current?: number; pageSize?: number; keyword?: string; [key: string]: unknown },
  apiFn: (backendParams: Record<string, unknown>) => Promise<{ data: { data?: { records?: unknown[]; total?: number } } }>,
  toItem: (raw: unknown) => T,
): Promise<ProTableResponse<T>> {
  const backendParams: BackendPageParam = {
    pageNo: params.current ?? 1,
    pageSize: params.pageSize ?? 10,
  }

  // 将 params 中的过滤字段透传给后端
  for (const [key, value] of Object.entries(params)) {
    if (!['current', 'pageSize', 'sort', 'filter'].includes(key) && value !== undefined && value !== '') {
      backendParams[key] = value
    }
  }

  const res = await apiFn(backendParams)
  const records = (res.data.data?.records as unknown[]) || []
  const total = Number(res.data.data?.total || 0)

  return {
    data: records.map(toItem),
    success: true,
    total,
  }
}

/** 通用列类型别名 */
export type { ProColumns }
