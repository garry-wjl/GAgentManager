export interface SkillItem {
  skillId: string
  num?: string
  skillName: string
  description: string
  icon?: string
  category: SkillCategory
  tags?: string[]
  version: string
  author: string
  installCount: number
  rating: number
  ratingCount: number
  status: SkillStatus
  isOfficial: boolean
  isFree: boolean
  minAgentVersion?: string
  createTime: string
  updater: string
  updateTime: string
}

export type SkillCategory = '数据处理' | '工具调用' | '内容生成' | '搜索查询' | '系统集成' | '自定义'
export type SkillStatus = '未安装' | '已安装' | '有更新可用'

export interface SkillVersion {
  versionId: string
  skillId: string
  version: string
  versionTag: '草稿' | '已发布' | '已废弃'
  changelog?: string
  creator: string
  publishTime?: string
  createTime: string
}
