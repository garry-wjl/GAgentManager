export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageResult<T> {
  records: T[]
  total: number
  current: number
  pageSize: number
}

export interface PageParams {
  current?: number
  pageSize?: number
}
