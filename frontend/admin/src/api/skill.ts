import { get, post, upload } from './request'
import type { SkillItem, SkillVersionItem, SkillReviewItem, InstallRecordItem, PageResult } from '../types'

/** Skill 管理 API，对齐后端接口：
 * Query: /api/skill/query/*
 * Command: /api/skill/command/*
 */

export function getSkills(params?: Record<string, unknown>) {
  return get<PageResult<SkillItem>>('/skill/query/list', { params })
}

export function getSkill(num: string) {
  return get<SkillItem>('/skill/query/detail', { params: { num } })
}

export function createSkill(data: SkillFormValues) {
  return post<SkillItem>('/skill/command/create', data)
}

export function updateSkill(data: SkillFormValues & { id: string }) {
  return post<void>('/skill/command/update', data)
}

export function deleteSkill(num: string) {
  return post<void>('/skill/command/delete', null, { params: { num } })
}

export function installSkill(num: string) {
  return post<void>('/skill/command/install', null, { params: { num } })
}

export function uninstallSkill(num: string) {
  return post<void>('/skill/command/uninstall', null, { params: { num } })
}

export function reviewSkill(data: { skillNum: string; rating: number; content?: string }) {
  return post<void>('/skill/command/review', data)
}

export function getSkillVersions(skillNum: string) {
  return get<SkillVersionItem[]>('/skill/query/versions', { params: { skillNum } })
}

export function getSkillReviews(params?: Record<string, unknown>) {
  return get<PageResult<SkillReviewItem>>('/skill/query/reviews', { params })
}

export function getSkillInstallRecords(skillId: string) {
  return get<InstallRecordItem[]>('/skill/query/install-records', { params: { skillId } })
}

export function uploadSkillPackage(num: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return upload<SkillItem>('/skill/command/upload-package', formData, { params: { num } })
}

export interface SkillFormValues {
  skillCode?: string
  skillName: string
  description?: string
  category: string
  tags?: string[]
  author?: string
  isFree?: boolean
}
