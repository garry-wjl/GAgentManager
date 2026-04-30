import { get, post } from './request'
import type { SkillItem, SkillVersion, PageResult } from '../types'

/** Skill 管理 API，对齐后端 /api/admin/skills 接口 */

export function getSkills(params?: Record<string, unknown>) {
  return get<PageResult<SkillItem>>('/admin/skills/list', { params })
}

export function getSkill(id: string) {
  return get<SkillItem>('/admin/skills/get', { params: { id } })
}

export function createSkill(data: { skillName: string; description: string; category: string; tags?: string[] }) {
  return post<SkillItem>('/admin/skills/create', data)
}

export function updateSkill(data: { id: string; skillName: string; description: string; category: string; tags?: string[] }) {
  return post<SkillItem>('/admin/skills/update', data)
}

export function deleteSkill(num: string) {
  return post('/admin/skills/delete', null, { params: { num } })
}

export function installSkill(num: string, version?: string) {
  return post('/admin/skills/install', null, { params: { num } })
}

export function uninstallSkill(num: string) {
  return post('/admin/skills/uninstall', null, { params: { num } })
}

export function getSkillVersions(skillNum: string) {
  return get<SkillVersion[]>('/admin/skills/versions', { params: { skillNum } })
}
