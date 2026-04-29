import { get, post, put, del } from './request'
import type { ModelItem, ModelFormValues, ModelMonitoring, PageResult } from '../types'

export function getModels(params?: Record<string, unknown>) {
  return get<PageResult<ModelItem>>('/models', { params })
}

export function getModel(id: string) {
  return get<ModelItem>(`/models/${id}`)
}

export function createModel(data: ModelFormValues) {
  return post<ModelItem>('/models', data)
}

export function updateModel(id: string, data: ModelFormValues) {
  return put<ModelItem>(`/models/${id}`, data)
}

export function deleteModel(id: string) {
  return del(`/models/${id}`)
}

export function enableModel(id: string) {
  return post(`/models/${id}/enable`)
}

export function disableModel(id: string) {
  return post(`/models/${id}/disable`)
}

export function testModelConnection(id: string) {
  return post(`/models/${id}/test`)
}

export function getModelMonitoring(id: string) {
  return get<ModelMonitoring>(`/models/${id}/monitoring`)
}
