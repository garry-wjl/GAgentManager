import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { message } from 'antd'
import type { ApiResponse } from '../types'

/**
 * 业务错误码 → 前端处理策略
 * - 401 系列（认证失效）：清除登录态，跳转登录页
 * - 403（无权限）：提示后不跳转（用户可能仍在页面操作）
 * - 404（资源不存在）：提示错误
 * - 500（服务端异常）：提示友好错误
 * - 其他业务码：直接展示 message
 */
const BUSINESS_CODE_TO_ACTION: Record<number, { action: 'toast' | 'logout' | 'toast-only'; msg?: string }> = {
  // 认证类错误 → 清除登录态 + 跳转
  401: { action: 'logout' },
  1001: { action: 'logout', msg: '用户名或密码错误，请重新登录' },
  1004: { action: 'logout', msg: '登录已过期，请重新登录' },
  1005: { action: 'logout', msg: '登录凭证无效，请重新登录' },
  1006: { action: 'logout', msg: '登录已过期，请重新登录' },
  1020: { action: 'logout', msg: '会话失效，请重新登录' },

  // 权限类错误 → 仅提示
  403: { action: 'toast-only', msg: '无权限访问此功能' },
  1021: { action: 'toast' },
  1022: { action: 'toast' },
}

/** 执行统一的登出流程 */
function doLogout() {
  localStorage.removeItem('token')
  // 记录当前路径，登录后可以返回
  const currentPath = window.location.pathname
  window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
}

const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const { data } = response
    const code = data.code

    // 成功响应
    if (code === 0 || code === 200) {
      return response
    }

    // 业务错误处理
    const strategy = BUSINESS_CODE_TO_ACTION[code] ?? { action: 'toast' }
    const errorMsg = strategy.msg || data.message || '请求失败'

    switch (strategy.action) {
      case 'logout':
        message.error(errorMsg)
        doLogout()
        break
      case 'toast-only':
        // 403 等权限错误：用 error 提示，不打断页面操作
        message.error(errorMsg)
        break
      case 'toast':
      default:
        message.error(errorMsg)
        break
    }

    return Promise.reject(new Error(errorMsg))
  },
  (error) => {
    const status = error.response?.status
    const backendCode = error.response?.data?.code as number | undefined
    const backendMsg = error.response?.data?.message as string | undefined

    // 优先检查业务层定义的错误码
    if (backendCode !== undefined) {
      const strategy = BUSINESS_CODE_TO_ACTION[backendCode]
      if (strategy?.action === 'logout') {
        message.error(strategy.msg || error.message)
        doLogout()
        return Promise.reject(error)
      }
      if (strategy?.action === 'toast-only') {
        message.error(strategy.msg || backendMsg || error.message)
        return Promise.reject(error)
      }
    }

    // HTTP 状态码处理
    switch (status) {
      case 401:
        // 未认证：Token 缺失或过期
        message.error('登录已过期，请重新登录')
        doLogout()
        break
      case 403:
        // 无权限
        message.error(backendMsg || '无权限访问此功能')
        break
      case 404:
        // 资源不存在
        message.error(backendMsg || '请求的资源不存在')
        break
      case 405:
        message.error('请求方法不允许')
        break
      case 500:
        message.error('服务器内部错误，请稍后重试')
        break
      case 502:
        message.error('网关错误，服务暂时不可用')
        break
      case 503:
        message.error('服务维护中，请稍后重试')
        break
      case 504:
        message.error('网关超时，请稍后重试')
        break
      default:
        message.error(backendMsg || error.message || '网络请求失败')
        break
    }

    return Promise.reject(error)
  },
)

export function get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
  return request.get<ApiResponse<T>>(url, config)
}

export function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
  return request.post<ApiResponse<T>>(url, data, config)
}

export function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
  return request.put<ApiResponse<T>>(url, data, config)
}

export function del<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
  return request.delete<ApiResponse<T>>(url, config)
}

export default request
