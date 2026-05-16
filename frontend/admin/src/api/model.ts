import { get, post } from './request'
import type { ModelItem, ModelFormValues, PageResult } from '../types'

/** 模型管理 API，对齐后端 /api/admin/models 接口 */

export function getModels(params?: Record<string, unknown>) {
  return get<PageResult<ModelItem>>('/admin/models/list', { params })
}

export function getModel(id: string) {
  return get<ModelItem>('/admin/models/get', { params: { id } })
}

export function createModel(data: ModelFormValues) {
  return post<ModelItem>('/admin/models/create', data)
}

export function updateModel(data: ModelFormValues & { id: string }) {
  return post<ModelItem>('/admin/models/update', data)
}

export function deleteModel(num: string) {
  return post('/admin/models/delete', null, { params: { num } })
}

export function enableModel(num: string) {
  return post('/admin/models/enable', null, { params: { num } })
}

export function disableModel(num: string) {
  return post('/admin/models/disable', null, { params: { num } })
}

export function testModelConnection(num: string) {
  return post<TestResult>('/admin/models/test', null, { params: { num } })
}

export interface TestResult {
  success: boolean
  responseTime: number
  errorMessage: string
}
