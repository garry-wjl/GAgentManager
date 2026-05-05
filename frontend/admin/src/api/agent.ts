import { get, post } from './request'
import type { AgentItem, AgentFormValues, AgentVersionItem, AgentDetailVO, AgentResourceBinding, PageResult, BindModelParam, BindResourceParamV2, UpdateBindingSortParam, EnabledModelVO } from '../types'

/** Agent 管理 API，对齐后端 /api/admin/agents 接口 */

export function getAgents(params: Record<string, unknown>) {
  return get<PageResult<AgentItem>>('/admin/agents/list', { params })
}

export function getAgent(id: string) {
  return get<AgentItem>('/admin/agents/get', { params: { id } })
}

/** Agent 详情（通过 num 获取完整信息） */
export function getAgentDetail(num: string) {
  return get<AgentDetailVO>('/admin/agents/detail', { params: { num } })
}

/** Agent 资源绑定列表 */
export function getAgentBindings(agentId: string) {
  return get<AgentResourceBinding[]>('/admin/agents/bindings', { params: { agentId } })
}

export function createAgent(data: AgentFormValues) {
  return post<AgentItem>('/admin/agents/create', data)
}

export function updateAgent(data: AgentFormValues & { id: string }) {
  return post<AgentItem>('/admin/agents/update', data)
}

export function deleteAgent(num: string) {
  return post('/admin/agents/delete', null, { params: { num } })
}

export function publishAgent(num: string, data: { version: string; changeLog?: string }) {
  return post('/admin/agents/publish', data, { params: { num } })
}

/** 启动 Agent（对应后端 /start） */
export function startAgent(num: string) {
  return post('/admin/agents/start', null, { params: { num } })
}

/** 停止 Agent（对应后端 /stop） */
export function stopAgent(num: string) {
  return post('/admin/agents/stop', null, { params: { num } })
}

export function getAgentVersions(agentId: string) {
  return get<AgentVersionItem[]>('/admin/agents/versions', { params: { agentId } })
}

export function rollbackAgent(num: string, targetVersion: string) {
  return post('/admin/agents/rollback', null, { params: { num, targetVersion } })
}

/** 解绑资源 */
export function unbindResource(bindingNum: string) {
  return post('/admin/agents/unbind', null, { params: { bindingNum } })
}

/** 按类型查询资源绑定（含状态实时校验） */
export function getAgentBindingsByType(agentId: string, resourceType: string) {
  return get<AgentResourceBinding[]>('/admin/agents/bindings/by-type', { params: { agentId, resourceType } })
}

/** 查询所有已启用模型列表 */
export function getEnabledModels() {
  return get<EnabledModelVO[]>('/admin/agents/enabled-models')
}

/** 绑定模型 */
export function bindModel(agentNum: string, data: BindModelParam) {
  return post('/admin/agents/bind-model', data, { params: { agentNum } })
}

/** 绑定工作流 */
export function bindWorkflow(agentNum: string, data: BindResourceParamV2) {
  return post('/admin/agents/bind-workflow', data, { params: { agentNum } })
}

/** 解绑工作流 */
export function unbindWorkflow(bindingNum: string) {
  return post('/admin/agents/unbind-workflow', null, { params: { bindingNum } })
}

/** 启停工作流 */
export function toggleWorkflow(bindingNum: string) {
  return post('/admin/agents/toggle-workflow', null, { params: { bindingNum } })
}

/** 绑定 Skill */
export function bindSkill(agentNum: string, data: BindResourceParamV2) {
  return post('/admin/agents/bind-skill', data, { params: { agentNum } })
}

/** 解绑 Skill */
export function unbindSkill(bindingNum: string) {
  return post('/admin/agents/unbind-skill', null, { params: { bindingNum } })
}

/** 更新资源绑定排序 */
export function updateBindingSort(data: UpdateBindingSortParam) {
  return post('/admin/agents/update-binding-sort', data)
}
