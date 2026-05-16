# 用户端 (User)

GAgentManager 的用户界面，供最终用户使用 Agent 服务进行对话交互。

## 技术栈

React 18 + TypeScript + Ant Design 6 + Ant Design X + Vite + Zustand + Axios

## 功能模块

| 模块 | 说明 |
|------|------|
| **Agent 交互** | 与 Agent 进行对话、消息展示、流式输出 |
| **个人中心** | 个人资料查看与编辑、密码修改 |
| **历史记录** | 对话历史列表、会话管理 |
| **设置选项** | 用户偏好设置 |

## 快速开始

```bash
cd frontend/user

# 安装依赖
npm install

# 启动开发服务器（默认 5173 端口）
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
