import { get, post } from './request'
import type { ModelItem, ModelFormValues, PageResult } from '../types'

/** 模型管理 API，对齐后端接口：
 * Query: /api/model/query/*
 * Command: /api/model/command/*
 */

export function getModels(params?: Record<string, unknown>) {
  return get<PageResult<ModelItem>>('/model/query/list', { params })
}

export function getModel(num: string) {
  return get<ModelItem>('/model/query/detail', { params: { num } })
}

export function createModel(data: ModelFormValues) {
  return post<ModelItem>('/model/command/create', data)
}

export function updateModel(data: ModelFormValues & { id: string }) {
  return post<void>('/model/command/update', data)
}

export function deleteModel(num: string) {
  return post<void>('/model/command/delete', null, { params: { num } })
}

export function enableModel(num: string) {
  return post<void>('/model/command/enable', null, { params: { num } })
}

export function disableModel(num: string) {
  return post<void>('/model/command/disable', null, { params: { num } })
}

export function testModelConnection(num: string) {
  return post<TestResult>('/model/command/test', null, { params: { num } })
}

export interface TestResult {
  success: boolean
  responseTime: number
  errorMessage: string
}
