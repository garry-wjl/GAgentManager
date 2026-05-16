export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageResult<T> {
  records: T[]
  total: number
  pageNo: number
  pageSize: number
}

export interface PageParams {
  pageNo?: number
  pageSize?: number
}
