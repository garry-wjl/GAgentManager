# GAgent Manager Frontend

GAgentManager 的前端代码，分为**管理端 (admin)** 和**用户端 (user)** 两个子系统。

## 技术栈

| 组件 | 版本 | 说明 |
|------|------|------|
| React | 18 | UI 框架 |
| TypeScript | 5.x | 类型系统 |
| Vite | 5.x | 构建工具 |
| Axios | 1.7.x | HTTP 客户端 |
| Zustand | 5.x | 状态管理 |
| React Router | 6.x | 路由管理 |
| Day.js | 1.x | 日期处理 |

### 管理端 UI

| 组件 | 版本 |
|------|------|
| Ant Design | 5.x |
| Ant Design Pro Components | 2.x |
| Ant Design Icons | 5.x |

### 用户端 UI

| 组件 | 版本 |
|------|------|
| Ant Design | 6.x |
| Ant Design X | 2.x |

## 子系统说明

| 子系统 | 目录 | 端口 | 面向用户 | 功能 |
|--------|------|------|---------|------|
| **管理端** | `admin/` | 3000 | 系统管理员 / Agent 管理员 | Agent 管理、用户管理、模型管理、Skill 管理、MCP 管理、权限控制、系统配置、审计日志 |
| **用户端** | `user/` | 5173 | 最终用户 | Agent 对话交互、个人中心、历史记录、设置选项 |

## 快速开始

### 前置条件

- Node.js 18+
- npm 9+

### 管理端

```bash
cd frontend/admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview

# ESLint 检查
npm run lint
```

启动后访问: http://localhost:3000

### 用户端

```bash
cd frontend/user

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview

# ESLint 检查
npm run lint
```

启动后访问: http://localhost:5173

## 项目结构

### 管理端

```
frontend/admin/
├── package.json              # 依赖与脚本
├── vite.config.ts            # Vite 配置（代理、端口）
├── tsconfig.json             # TypeScript 配置
├── index.html                # HTML 入口
└── src/
    ├── api/                  # API 请求封装
    │   ├── auth.ts           # 认证相关 API
    │   ├── user.ts           # 用户管理 API
    │   ├── agent.ts          # Agent 管理 API
    │   ├── model.ts          # 模型管理 API
    │   ├── skill.ts          # Skill 管理 API
    │   ├── rbac.ts           # 权限管理 API
    │   └── ...
    ├── pages/                # 页面组件
    │   ├── Login/            # 登录页
    │   ├── Home/             # 首页仪表盘
    │   ├── UserManagement/   # 用户管理
    │   ├── AgentManagement/  # Agent 管理
    │   ├── ModelManagement/  # 模型管理
    │   ├── SkillManagement/  # Skill 管理
    │   └── ...
    ├── components/           # 通用组件
    ├── types/                # TypeScript 类型定义
    ├── utils/                # 工具函数
    ├── layouts/              # 布局组件
    ├── App.tsx               # 路由入口
    └── main.tsx              # 应用入口
```

### 用户端

```
frontend/user/
├── package.json              # 依赖与脚本
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
├── index.html                # HTML 入口
└── src/
    ├── api/                  # API 请求封装
    ├── pages/                # 页面组件
    ├── components/           # 通用组件
    ├── types/                # TypeScript 类型定义
    ├── utils/                # 工具函数
    ├── App.tsx               # 路由入口
    └── main.tsx              # 应用入口
```

## 开发指南

### API 代理配置

前端开发服务器通过 Vite proxy 将 `/api` 请求代理到后端服务（默认 http://localhost:8080）。

**admin/vite.config.ts：**

```typescript
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

### API 调用

HTTP 请求统一封装在 `src/utils/request.ts` 中：

```typescript
import request from '../utils/request'

// GET 请求
export function getUserList(params: PageParam) {
  return request.get('/api/user/query/list', { params })
}

// POST 请求
export function createUser(data: CreateUserParam) {
  return request.post('/api/user/command/create', data)
}
```

### 状态管理

使用 Zustand 进行全局状态管理：

```typescript
import { create } from 'zustand'

interface UserStore {
  user: UserInfo | null
  setUser: (user: UserInfo) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

### 编码规范

- 使用 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 路由统一在 `src/App.tsx` 管理
- 页面组件放在 `src/pages/` 目录
- 通用组件放在 `src/components/` 目录
- 类型定义放在 `src/types/` 目录
