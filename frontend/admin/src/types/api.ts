export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PageResult<T> {
  records: T[]
  total: number
  current: number
  size: number
}

export interface PageParams {
  current: number
  size: number
}

export interface SortParams {
  field?: string
  order?: 'ascend' | 'descend'
}
