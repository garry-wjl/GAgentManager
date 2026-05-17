# 管理端 (Admin)

GAgentManager 的管理界面，用于系统管理员和 Agent 管理员对平台进行全面管理。

## 技术栈

React 18 + TypeScript + Ant Design 5 + Ant Design Pro Components + Vite + Zustand + Axios

## 功能模块

| 模块 | 说明 |
|------|------|
| **登录** | JWT 认证登录、Token 自动管理 |
| **首页仪表盘** | 数据统计、可视化、平台运行概览 |
| **用户管理** | 用户列表、详情、编辑、状态管理、部门归属 |
| **Agent 管理** | Agent CRUD、版本管理、资源绑定（模型/Skill/MCP） |
| **模型管理** | 模型注册、启用/停用、编辑、筛选、列表查看 |
| **Skill 管理** | Skill 注册、发布、审核、版本管理 |
| **MCP 管理** | MCP 服务注册、版本管理、日志查看 |
| **权限管理** | 角色管理、权限资源配置、用户角色分配 |
| **系统配置** | 全局配置项管理 |
| **审计日志** | 操作审计查询、操作记录追溯 |

## 快速开始

```bash
cd frontend/admin

# 安装依赖
npm install

# 启动开发服务器（默认 3000 端口）
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview

# ESLint 检查
npm run lint
```

## 代理配置

开发模式下 `/api` 请求代理到后端服务 http://localhost:8080
