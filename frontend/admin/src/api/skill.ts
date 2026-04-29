import { get, post, put, del } from './request'
import type { SkillItem, SkillVersion, PageResult } from '../types'

export function getSkills(params?: Record<string, unknown>) {
  return get<PageResult<SkillItem>>('/skills', { params })
}

export function getSkill(id: string) {
  return get<SkillItem>(`/skills/${id}`)
}

export function createSkill(data: { skillName: string; description: string; category: string; tags?: string[] }) {
  return post<SkillItem>('/skills', data)
}

export function updateSkill(id: string, data: { skillName: string; description: string; category: string; tags?: string[] }) {
  return put<SkillItem>(`/skills/${id}`, data)
}

export function deleteSkill(id: string) {
  return del(`/skills/${id}`)
}

export function publishSkill(id: string) {
  return post(`/skills/${id}/publish`)
}

export function getSkillVersions(id: string) {
  return get<SkillVersion[]>(`/skills/${id}/versions`)
}

export function installSkill(id: string, version?: string) {
  return post(`/skills/${id}/install`, { version })
}

export function uninstallSkill(id: string) {
  return post(`/skills/${id}/uninstall`)
}
