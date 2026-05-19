export interface SkillItem {
  skillId: string
  num?: string
  skillCode?: string
  skillName: string
  description?: string
  icon?: string
  category: SkillCategory
  tags?: string[]
  version?: string
  author?: string
  installCount: number
  rating: number
  ratingCount: number
  status: SkillStatus
  _rawStatus?: string
  isOfficial: boolean
  isFree: boolean
  minAgentVersion?: string
  createTime: string
  updater: string
  updateTime: string
  packageUrl?: string
}

export type SkillCategory = '数据处理' | '工具调用' | '内容生成' | '搜索查询' | '系统集成' | '自定义'
export type SkillStatus = '未安装' | '已安装' | '已禁用'

export interface SkillVersionItem {
  num?: string
  version: string
  versionTag: string
  changelog?: string
  creator: string
  publishTime?: string
  createTime: string
}

export interface SkillReviewItem {
  num?: string
  skillId: number
  username: string
  rating: number
  content?: string
  isVerified: boolean
  replyCount: number
  createTime: string
}

export interface InstallRecordItem {
  num?: string
  skillId: number
  skillName: string
  installedVersion: string
  installStatus: string
  installUser: string
  installTime: string
  failReason?: string
}

export interface SkillFormValues {
  skillCode?: string
  skillName: string
  description?: string
  category: SkillCategory
  tags?: string[]
  author?: string
  isFree?: boolean
}
