# GAgentManager

> 企业级 Agent（智能体）管理平台

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-blue.svg)](https://ant.design/)
[![MyBatis Plus](https://img.shields.io/badge/MyBatis%20Plus-3.5.9-red.svg)](https://baomidou.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)

---

## 目录

- [项目简介](#项目简介)
- [核心特性](#核心特性)
- [技术栈](#技术栈)
- [系统架构](#系统架构)
- [模块结构](#模块结构)
- [数据库设计](#数据库设计)
- [快速开始](#快速开始)
- [API 文档](#api-文档)
- [前端开发](#前端开发)
- [开发指南](#开发指南)
- [项目结构](#项目结构)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 项目简介

GAgentManager 是一个企业级的 Agent（智能体）管理平台，提供 Agent 的全生命周期管理能力。平台采用前后端分离架构，后端基于 Spring Boot 3.4 + Java 21 构建，前端基于 React 18 + Ant Design 5 构建。

**平台定位：**

- **管理端**：面向系统管理员和 Agent 管理员，提供用户管理、Agent 管理、模型管理、Skill 管理、MCP 管理、权限控制、系统配置等能力
- **用户端**：面向最终用户，提供 Agent 对话交互、历史记录查看、个人中心等功能

**设计原则：**

- 采用 DDD（领域驱动设计）六层架构，确保代码清晰可维护
- 各功能模块独立，支持按需扩展
- 统一的 RBAC 权限模型
- 完整的审计日志链路

---

## 核心特性

| 模块 | 功能 | 说明 |
|------|------|------|
| **用户管理** | 用户 CRUD、个人资料、批量操作 | 支持用户状态管理、部门归属、头像等 |
| **Agent 管理** | Agent CRUD、版本管理、命令控制 | 支持 Agent 的创建、发布、绑定模型/Skill/MCP |
| **模型管理** | 模型注册、启用/停用、编辑、删除 | 支持主流 LLM 提供商和自部署模型，API Key 加密存储 |
| **Skill 管理** | Skill 注册、发布、版本管理 | 支持 Skill 的注册、审核、安装、评论 |
| **MCP 管理** | MCP 服务注册、版本管理、日志 | 支持 Model Context Protocol 服务管理 |
| **对话系统** | 会话管理、消息交互、引用分享 | 支持用户与 Agent 的多轮对话 |
| **权限管理** | 角色管理、权限分配、用户角色绑定 | 基于 RBAC 模型的细粒度权限控制 |
| **审计日志** | 操作审计查询 | 记录所有管理操作，支持追溯 |
| **系统配置** | 全局配置管理 | 支持系统级配置项管理 |
| **文件管理** | 文件上传/下载、附件预览 | 支持多种文件类型，本地/MinIO/OSS 存储 |
| **Prompt 管理** | 推荐 Prompt 查询与管理 | 提供 Prompt 模板库 |
| **工作流** | 工作流编排、命令控制 | 支持 Agent 工作流定义与执行 |
| **首页仪表盘** | 数据可视化、统计分析 | 提供平台运行数据的可视化展示 |
| **设备管理** | 登录设备查看、强制下线 | 支持用户登录设备管理 |

---

## 技术栈

### 后端

| 组件 | 版本 | 说明 |
|------|------|------|
| Java | 21 | 编程语言 |
| Spring Boot | 3.4.1 | 应用框架 |
| MyBatis Plus | 3.5.9 | 数据持久层 |
| MySQL | 8.0.33 | 关系型数据库 |
| JWT (jjwt) | 0.12.6 | 认证令牌 |
| Spring AI | 1.0.0 | AI 集成框架 |
| Spring AI Alibaba | 1.0.0.2 | 阿里云 AI 集成 |
| Knife4j (Swagger) | 4.5.0 | API 文档 |
| Hutool | 5.8.35 | Java 工具库 |
| Lombok | 1.18.38 | 代码简化 |

### 前端

| 组件 | 版本 | 说明 |
|------|------|------|
| React | 18 | UI 框架 |
| TypeScript | 5.x | 类型系统 |
| Ant Design | 5.x (管理端) / 6.x (用户端) | UI 组件库 |
| Ant Design Pro Components | 2.x | 高级业务组件 |
| Vite | 5.x | 构建工具 |
| Axios | 1.7.x | HTTP 客户端 |
| Zustand | 5.x | 状态管理 |
| React Router | 6.x | 路由管理 |
| Day.js | 1.x | 日期处理 |

---

## 系统架构

### 后端分层架构

项目采用 DDD 六层分层架构，各层职责清晰：

```
┌──────────────────────────────────────────────────────────┐
│                     adapter (适配层)                      │
│  HTTP Controllers、安全配置、全局异常处理、跨域配置        │
├──────────────────────────────────────────────────────────┤
│                   application (应用层)                     │
│  Application Service、用例编排、事务边界                    │
├──────────────────────────────────────────────────────────┤
│                     domain (领域层)                        │
│  聚合根、领域服务、仓储接口、领域枚举、领域事件              │
├──────────────────────────────────────────────────────────┤
│                     infra (基础设施层)                     │
│  仓储实现、MyBatis Mapper、DO 实体、第三方 SDK 调用        │
├──────────────────────────────────────────────────────────┤
│                     facade (门面层)                        │
│  业务无关的通用接口定义与 DTO（可移植）                      │
├──────────────────────────────────────────────────────────┤
│                     client (客户端层)                      │
│  DTO/VO/Param 定义，跨层传输对象                            │
└──────────────────────────────────────────────────────────┘
                          ↑
                    start (启动模块)
          Spring Boot 入口、配置文件
```

**依赖方向：**

```
start → adapter → application → domain → client
                                        ↑
infra ──────────────────────────────────┘
facade ───→ client (接口定义)
```

**分层约束：**

- **adapter** 仅依赖 application 和 client，通过 Controller 暴露 REST API
- **application** 仅依赖 domain 和 client，编排用例、管理事务
- **domain** 仅依赖 client，包含核心业务逻辑和领域模型
- **infra** 依赖 domain 和 client，实现仓储接口（MyBatis Plus Mapper + DO）
- **facade** 仅依赖 client，提供可移植的接口定义
- **client** 无内部依赖，仅包含数据传输对象

### 认证机制

采用 JWT 双 Token 机制：

| Token 类型 | 有效期 | 用途 |
|------------|--------|------|
| Access Token | 2 小时 | API 请求鉴权 |
| Refresh Token | 7 天 | 刷新 Access Token |

### 权限模型

基于 RBAC（Role-Based Access Control）模型：

```
用户 ←→ 用户角色关联 ←→ 角色 ←→ 角色权限关联 ←→ 权限资源 + 权限动作
```

---

## 模块结构

### 后端模块

```
backend/
├── adapter/       # 适配层 — HTTP Controllers、安全配置、全局异常处理
├── application/   # 应用层 — Application Service、用例编排、事务边界
├── client/        # 客户端层 — DTO/VO/Param 定义，跨层传输对象
├── domain/        # 领域层 — 实体、领域服务、仓储接口、领域枚举
├── facade/        # 门面层 — 业务无关的通用接口定义与 DTO（可移植）
├── infra/         # 基础设施层 — 仓储实现、Mapper、DO 实体、第三方 SDK
├── start/         # 启动模块 — Spring Boot 入口、配置文件
├── sql/           # 数据库初始化脚本
└── pom.xml        # Maven 父 POM
```

### 前端模块

```
frontend/
├── admin/         # 管理端 — 管理员界面（Agent管理、用户管理、模型管理等）
├── user/          # 用户端 — 用户交互界面（Agent对话、个人中心等）
└── README.md      # 前端说明文档
```

---

## 数据库设计

### 表清单（共 24 张表）

| 表名 | 说明 |
|------|------|
| `user` | 用户表 |
| `role` | 角色表 |
| `permission_resource` | 权限资源表 |
| `permission_action` | 权限动作表 |
| `role_permission` | 角色权限关联表 |
| `user_role` | 用户角色关联表 |
| `audit_log` | 审计日志表 |
| `system_config` | 系统配置表 |
| `notice` | 通知公告表 |
| `model` | AI 模型表 |
| `agent` | Agent 表 |
| `agent_version` | Agent 版本表 |
| `agent_resource_binding` | Agent 资源绑定表 |
| `mcp_service` | MCP 服务表 |
| `mcp_version` | MCP 版本表 |
| `mcp_log` | MCP 日志表 |
| `mcp_template` | MCP 模板表 |
| `skill` | Skill 表 |
| `skill_version` | Skill 版本表 |
| `skill_install_record` | Skill 安装记录表 |
| `skill_review` | Skill 评论表 |
| `chat_session` | 对话会话表 |
| `chat_message` | 对话消息表 |
| `workflow` | 工作流表 |

### 数据库初始化

```bash
mysql -u root -p < backend/sql/init.sql
```

---

## 快速开始

### 前置条件

- **JDK 21+**
- **Maven 3.8+**
- **MySQL 8.0+**
- **Node.js 18+**
- **npm 9+**

### 1. 克隆项目

```bash
git clone https://github.com/your-org/GAgentManager.git
cd GAgentManager
```

### 2. 初始化数据库

```bash
mysql -u root -p < backend/sql/init.sql
```

如需扩展数据，可依次执行：

```bash
mysql -u root -p < backend/sql/2026-05-15_agent_management_extension.sql
mysql -u root -p < backend/sql/2026-05-05_user_end_refactor.sql
```

### 3. 配置后端

编辑 `backend/start/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/gagent_manager?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: your-password   # 修改为你的数据库密码
```

### 4. 启动后端

```bash
cd backend
mvn clean package -DskipTests
java -jar start/target/start-1.0.0-SNAPSHOT.jar
```

或使用 Maven 插件直接运行：

```bash
cd backend
mvn spring-boot:run -pl start
```

启动成功后访问：
- API 文档: http://localhost:8080/doc.html
- API 基础路径: http://localhost:8080/api/

### 5. 启动前端

**管理端：**

```bash
cd frontend/admin
npm install
npm run dev
```

访问: http://localhost:3000

**用户端：**

```bash
cd frontend/user
npm install
npm run dev
```

访问: http://localhost:5173

---

## API 文档

### 接口规范

- 所有接口统一 `/api` 前缀
- 返回格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

- 请求鉴权：`Authorization: Bearer <access-token>`

### 主要接口前缀

| 模块 | URL 前缀 | 说明 |
|------|---------|------|
| 认证 | `/api/auth` | 登录、注册、刷新 Token |
| 用户 | `/api/user` | 用户 CRUD、个人资料 |
| Agent | `/api/agent` | Agent 管理 |
| 模型 | `/api/model/query/*` + `/api/model/command/*` | 模型查询与命令 |
| Skill | `/api/skill` | Skill 管理 |
| MCP | `/api/mcp` | MCP 服务管理 |
| 对话 | `/api/chat` | 对话交互 |
| 文件 | `/api/file` | 文件上传/下载 |
| 权限 | `/api/rbac` | 角色权限管理 |
| 审计 | `/api/audit` | 审计日志查询 |
| 配置 | `/api/system-config` | 系统配置 |
| 首页 | `/api/home` | 仪表盘数据 |
| Prompt | `/api/prompt` | Prompt 管理 |
| 工作流 | `/api/workflow` | 工作流管理 |

### 接口文档

启动后端服务后，可通过 Knife4j 查看完整的 REST API 交互式文档：http://localhost:8080/doc.html

---

## 前端开发

### 管理端 (admin)

基于 React 18 + Ant Design 5 + Pro Components 构建，主要功能模块：

- **登录/认证** — JWT Token 管理
- **首页仪表盘** — 数据统计与可视化
- **用户管理** — 用户列表、详情、编辑、状态管理
- **Agent 管理** — Agent CRUD、版本管理、资源绑定
- **模型管理** — 模型注册、启用/停用、编辑、筛选
- **Skill 管理** — Skill 注册、发布、审核
- **MCP 管理** — MCP 服务注册、版本管理
- **权限管理** — 角色、权限资源、用户角色分配
- **系统配置** — 全局配置项管理
- **审计日志** — 操作审计查询

**开发模式：**

```bash
cd frontend/admin
npm run dev          # 启动开发服务器（默认 3000 端口）
npm run build        # 生产构建
npm run preview      # 预览构建产物
npm run lint         # ESLint 检查
```

### 用户端 (user)

基于 React 18 + Ant Design 6 + @ant-design/x 构建，主要功能模块：

- **Agent 交互** — 对话界面、消息展示
- **个人中心** — 个人资料、密码修改
- **历史记录** — 对话历史、会话管理
- **设置选项** — 用户偏好设置

**开发模式：**

```bash
cd frontend/user
npm run dev          # 启动开发服务器（默认 5173 端口）
npm run build        # 生产构建
npm run preview      # 预览构建产物
npm run lint         # ESLint 检查
```

### 前后端代理配置

前端开发服务器通过 Vite proxy 将 `/api` 请求代理到后端服务（默认 http://localhost:8080）。

**admin/vite.config.ts：**

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

---

## 开发指南

### 后端开发

#### 构建命令

```bash
cd backend

# 全量构建（跳过测试）
mvn clean package -DskipTests

# 仅编译指定模块
mvn clean compile -pl adapter,application,domain

# 运行测试
mvn test

# 运行指定模块的测试
mvn test -pl domain
```

#### 新增功能模块步骤

以新增 `notification` 模块为例：

1. **client 层**：在 `client/src/main/java/com/gagentmanager/client/notification/` 中定义 DTO/Param
2. **domain 层**：在 `domain/src/main/java/com/gagentmanager/domain/notification/` 中定义聚合根、仓储接口
3. **infra 层**：在 `infra/src/main/java/com/gagentmanager/infra/notification/` 中实现仓储、Mapper、Entity
4. **application 层**：在 `application/src/main/java/com/gagentmanager/application/notification/` 中定义 Service
5. **adapter 层**：在 `adapter/src/main/java/com/gagentmanager/adapter/notification/` 中定义 Controller
6. **数据库**：在 `backend/sql/` 中添加建表脚本

#### 软删除

项目使用 MyBatis Plus 逻辑删除，配置在 `application.yml`：

```yaml
mybatis-plus:
  global-config:
    db-config:
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0
```

使用 `deleteById` 会自动设置为 `deleted=1`，查询时自动过滤已删除数据。

### 前端开发

#### 编码规范

- 使用 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 状态管理使用 Zustand
- HTTP 请求统一封装在 `src/api/` 目录
- 路由统一在 `src/App.tsx` 管理

#### API 调用

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

---

## 项目结构

```
GAgentManager/
├── README.md                          # 项目总览文档
├── LICENSE                            # Apache 2.0 许可证
├── CONTRIBUTING.md                    # 贡献指南
├── .gitignore                         # Git 忽略规则
├── package.json                       # 根级别依赖
│
├── doc/                               # 产品/技术文档
│   ├── 产品方案/                       # PRD 文档
│   ├── 技术方案/                       # 技术设计文档
│   ├── 测试方案/                       # 测试设计文档
│   └── issue/                         # 规划与追踪
│
├── backend/                           # 后端服务
│   ├── pom.xml                        # Maven 父 POM
│   ├── adapter/                       # 适配层 (Controllers)
│   ├── application/                   # 应用层 (Services)
│   ├── client/                        # 客户端层 (DTO/VO)
│   ├── domain/                        # 领域层 (Entities/Repos)
│   ├── facade/                        # 门面层 (通用接口)
│   ├── infra/                         # 基础设施层 (Mapper/Impl)
│   ├── start/                         # 启动模块 (入口/配置)
│   └── sql/                           # 数据库脚本
│
└── frontend/                          # 前端应用
    ├── README.md                      # 前端说明
    ├── admin/                         # 管理端 (React + Ant Design 5)
    │   ├── package.json
    │   ├── vite.config.ts
    │   └── src/
    │       ├── api/                   # API 请求封装
    │       ├── pages/                 # 页面组件
    │       ├── components/            # 通用组件
    │       ├── types/                 # TypeScript 类型
    │       ├── utils/                 # 工具函数
    │       └── App.tsx                # 路由入口
    └── user/                          # 用户端 (React + Ant Design 6)
        ├── package.json
        ├── vite.config.ts
        └── src/
```

---

## 贡献指南

我们欢迎所有形式的贡献！

1. **Fork** 本仓库
2. 创建你的特性分支：`git checkout -b feature/my-feature`
3. 提交你的修改：`git commit -m 'feat: add my feature'`
4. 推送到分支：`git push origin feature/my-feature`
5. 提交 **Pull Request**

### 提交规范

提交信息请遵循 Conventional Commits 格式：

- `feat:` 新功能
- `fix:` 修复 Bug
- `docs:` 文档变更
- `style:` 代码格式（不影响功能）
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/辅助工具变更

详细的贡献指南请参考 [CONTRIBUTING.md](./CONTRIBUTING.md)。

---

## 许可证

本项目采用 Apache License 2.0 许可证 - 详见 [LICENSE](./LICENSE) 文件。

```
Copyright 2026 GAgentManager Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
