import { get, post } from './request'
import type { ApiResponse } from '../types/api'
import type { UploadResultVO } from '../types/chat'

export function uploadFile(sessionNum: string, file: File) {
  const formData = new FormData()
  formData.append('sessionNum', sessionNum)
  formData.append('file', file)
  return post<ApiResponse<UploadResultVO>>('/api/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function downloadFile(fileNum: string) {
  return get<Blob>('/api/file/download', {
    params: { fileNum },
    responseType: 'blob',
  })
}
