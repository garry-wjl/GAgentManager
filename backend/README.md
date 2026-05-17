# GAgent Manager Backend

企业级 Agent（智能体）管理平台后端服务。

基于 Spring Boot 3.4 + Java 21 构建，采用 DDD 六层分层架构（Adapter / Application / Client / Domain / Facade / Infra）+ Start 启动模块。

## 技术栈

| 组件 | 版本 | 说明 |
|------|------|------|
| Java | 21 | 编程语言 |
| Spring Boot | 3.4.1 | 应用框架 |
| MyBatis Plus | 3.5.9 | 数据持久层 ORM |
| MySQL | 8.0.33 | 关系型数据库 |
| JWT (jjwt) | 0.12.6 | JSON Web Token 认证 |
| Spring AI | 1.0.0 | AI 集成框架 |
| Spring AI Alibaba | 1.0.0.2 | 阿里云 AI 集成 |
| Knife4j (Swagger) | 4.5.0 | API 文档生成 |
| Hutool | 5.8.35 | Java 工具库 |
| Lombok | 1.18.38 | 代码简化注解 |

## 模块结构

```
backend/
├── adapter/       # 适配层 — HTTP Controllers、安全配置、全局异常处理
├── application/   # 应用层 — Application Service、用例编排、事务边界
├── client/        # 客户端层 — DTO/VO/Param 定义，跨层传输对象
├── domain/        # 领域层 — 实体、领域服务、仓储接口、领域枚举
├── facade/        # 门面层 — 业务无关的通用接口定义与 DTO（可移植）
├── infra/         # 基础设施层 — 仓储实现、Mapper、DO 实体、第三方 SDK 调用
├── start/         # 启动模块 — Spring Boot 入口、配置文件（application.yml）
└── sql/           # 数据库初始化脚本
```

## 模块依赖关系

```
start → adapter → application → domain → client
                                        ↑
infra ──────────────────────────────────┘
facade ───→ client (接口定义)
```

| 层级 | 依赖 | 职责 |
|------|------|------|
| **adapter** | application, client | 通过 Controller 暴露 REST API，处理 HTTP 请求/响应 |
| **application** | domain, client | 编排用例、管理事务、协调领域服务 |
| **domain** | client | 核心业务逻辑、聚合根、领域规则、仓储接口 |
| **infra** | domain, client | 仓储实现（MyBatis Plus Mapper + DO）、第三方 SDK 调用 |
| **facade** | client | 可移植的通用接口定义与 DTO |
| **client** | 无 | 数据传输对象（DTO/VO/Param） |
| **start** | adapter | Spring Boot 入口、配置文件 |

## 功能模块

| 模块 | 包路径 | 说明 |
|------|--------|------|
| auth | `adapter.auth` | 用户认证 — JWT 登录、注册、Token 刷新 |
| user | `adapter.user` | 用户管理 — 用户 CRUD、个人资料、聊天 |
| agent | `adapter.agent` | Agent 管理 — Agent CRUD、命令控制、用户端查询 |
| chat | `adapter.chat` | 聊天 — 用户端对话交互、消息引用、对话分享 |
| file | `adapter.file` | 文件管理 — 文件上传/下载、附件预览、本地存储 |
| prompt | `adapter.prompt` | Prompt 模板 — 推荐 Prompt 查询与管理 |
| device | `adapter.device` | 设备管理 — 登录设备查看、强制下线 |
| skill | `adapter.skill` | Skill 管理 — Skill 注册、发布、命令控制 |
| model | `adapter.model` | 模型管理 — AI 模型配置、启用/停用、命令控制 |
| workflow | `adapter.workflow` | 工作流管理 — 工作流编排、命令控制 |
| mcp | `adapter.mcp` | MCP 协议 — Model Context Protocol 命令 |
| home | `adapter.home` | 首页 — 数据可视化仪表盘、统计分析接口 |
| audit | `adapter.audit` | 审计日志 — 操作审计查询 |
| rbac | `adapter.rbac` | 权限管理 — 角色、权限 CRUD |
| system_config | `adapter.system_config` | 系统配置 — 全局配置管理 |

## 架构设计

### DDD 六层架构

```
┌─────────────────────────────────────────────────┐
│              adapter (适配层)                     │
│  REST Controllers / SecurityConfig / Exceptions  │
├─────────────────────────────────────────────────┤
│           application (应用层)                    │
│  CommandService / QueryService / Transaction      │
├─────────────────────────────────────────────────┤
│              domain (领域层)                      │
│  Aggregate Root / Domain Service / Repository     │
│  Interface / Enum / Event                         │
├─────────────────────────────────────────────────┤
│           infra (基础设施层)                      │
│  RepositoryImpl / Mapper / DO / ThirdParty SDK    │
├─────────────────────────────────────────────────┤
│              facade (门面层)                      │
│  Common Interface / Portable DTO                  │
├─────────────────────────────────────────────────┤
│              client (客户端层)                    │
│  DTO / VO / Param / PageResult                    │
└─────────────────────────────────────────────────┘
                        ↑
                  start (启动)
        Application Entry / application.yml
```

### 认证机制

采用 JWT 双 Token 机制：

| Token 类型 | 有效期 | 用途 |
|------------|--------|------|
| Access Token | 2 小时 (7200s) | API 请求鉴权 |
| Refresh Token | 7 天 (604800s) | 刷新 Access Token |

请求时在 Header 中携带：`Authorization: Bearer <access-token>`

### 软删除

使用 MyBatis Plus 逻辑删除，全局配置在 `application.yml`：

```yaml
mybatis-plus:
  global-config:
    db-config:
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0
```

- 使用 `deleteById` 会自动设置 `deleted=1`
- 查询时自动过滤 `deleted=1` 的数据
- `updateById` 会跳过 `deleted` 字段

### 文件存储

支持本地文件存储（开发环境），可扩为 MinIO/OSS：

```yaml
file:
  storage:
    local:
      base-path: ./gagent-files        # 本地存储目录
      url-prefix: http://localhost:8080/api/file/download?key=
    max-file-size: 20971520            # 单文件最大 20MB
    allowed-types:                     # 允许的文件类型
      - image/png
      - image/jpeg
      - text/plain
      - application/pdf
      # ...
```

## 数据库

### 表清单（24 张表）

| 分类 | 表名 | 说明 |
|------|------|------|
| **用户** | `user` | 用户表 |
| **权限** | `role` | 角色表 |
| | `permission_resource` | 权限资源表 |
| | `permission_action` | 权限动作表 |
| | `role_permission` | 角色权限关联表 |
| | `user_role` | 用户角色关联表 |
| **Agent** | `agent` | Agent 表 |
| | `agent_version` | Agent 版本表 |
| | `agent_resource_binding` | Agent 资源绑定表 |
| **模型** | `model` | AI 模型表 |
| **Skill** | `skill` | Skill 表 |
| | `skill_version` | Skill 版本表 |
| | `skill_install_record` | Skill 安装记录表 |
| | `skill_review` | Skill 评论表 |
| **MCP** | `mcp_service` | MCP 服务表 |
| | `mcp_version` | MCP 版本表 |
| | `mcp_log` | MCP 日志表 |
| | `mcp_template` | MCP 模板表 |
| **对话** | `chat_session` | 对话会话表 |
| | `chat_message` | 对话消息表 |
| **其他** | `audit_log` | 审计日志表 |
| | `system_config` | 系统配置表 |
| | `notice` | 通知公告表 |
| | `workflow` | 工作流表 |

### 初始化

```bash
# 基础建表
mysql -u root -p < backend/sql/init.sql

# Agent 管理扩展
mysql -u root -p < backend/sql/2026-05-15_agent_management_extension.sql

# 用户端重构
mysql -u root -p < backend/sql/2026-05-05_user_end_refactor.sql
```

## 快速开始

### 前置条件

- JDK 21+
- Maven 3.8+
- MySQL 8.0+

### 1. 初始化数据库

```bash
mysql -u root -p < backend/sql/init.sql
```

### 2. 修改配置

编辑 `start/src/main/resources/application.yml`，修改数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/gagent_manager
    username: root
    password: your-password
```

### 3. 构建 & 启动

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

### 4. 访问服务

- API 文档: http://localhost:8080/doc.html
- API 基础路径: http://localhost:8080/api/

## API 接口

启动后可通过 Knife4j 查看完整的 REST API 文档。所有接口统一使用 `/api` 前缀，返回格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 主要接口一览

| 模块 | URL 前缀 | HTTP 方法 | 说明 |
|------|---------|-----------|------|
| 认证 | `/api/auth` | POST | 登录、注册、刷新 Token |
| 用户查询 | `/api/user/query/*` | GET | 用户列表、详情 |
| 用户命令 | `/api/user/command/*` | POST | 用户创建、更新、删除 |
| Agent 查询 | `/api/agent/query/*` | GET | Agent 列表、详情 |
| Agent 命令 | `/api/agent/command/*` | POST | Agent 创建、更新、删除 |
| 模型查询 | `/api/model/query/*` | GET | 模型列表、详情、已启用模型 |
| 模型命令 | `/api/model/command/*` | POST | 模型创建、更新、删除、启用、禁用 |
| 对话查询 | `/api/chat/query/*` | GET | 会话列表、消息列表 |
| 对话命令 | `/api/chat/command/*` | POST | 创建会话、发送消息 |
| 文件 | `/api/file/*` | GET/POST | 上传、下载 |
| 权限查询 | `/api/rbac/query/*` | GET | 角色列表、权限列表 |
| 权限命令 | `/api/rbac/command/*` | POST | 角色创建、权限分配 |
| 审计查询 | `/api/audit/query/*` | GET | 审计日志列表 |
| 配置查询 | `/api/system-config/query/*` | GET | 配置列表 |
| 配置命令 | `/api/system-config/command/*` | POST | 配置创建、更新 |

## 开发指南

### 新增功能模块

以新增 `notification` 模块为例：

1. **client 层** — 在 `client/src/main/java/com/gagentmanager/client/notification/` 定义 DTO/Param
2. **domain 层** — 在 `domain/src/main/java/com/gagentmanager/domain/notification/` 定义聚合根、仓储接口、领域枚举
3. **infra 层** — 在 `infra/src/main/java/com/gagentmanager/infra/notification/` 实现仓储、Mapper、Entity
4. **application 层** — 在 `application/src/main/java/com/gagentmanager/application/notification/` 定义 Service
5. **adapter 层** — 在 `adapter/src/main/java/com/gagentmanager/adapter/notification/` 定义 Controller
6. **数据库** — 在 `backend/sql/` 中添加建表脚本

### 构建命令

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

### 代码风格

- 使用 Lombok 简化 getter/setter/构造器
- 领域对象使用聚合根模式，业务方法定义在聚合根上
- 仓储接口定义在 domain 层，实现在 infra 层
- 应用服务使用 `@Transactional` 管理事务
- 统一异常处理在 `GlobalExceptionHandler` 中
