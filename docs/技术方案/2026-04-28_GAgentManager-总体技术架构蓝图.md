# GAgentManager 总体技术架构蓝图

> **文档版本**：V2.4
> **创建日期**：2026-04-28
> **更新日期**：2026-04-29
> **关联 PRD**：[PRD-GAgentManager-V5.0](../prd/PRD-GAgentManager-V5.0.md)
> **文档定位**：总体架构蓝图 — 定义全局技术栈、六层包结构、领域划分、数据库全景；各业务领域的详细技术方案（DDD 领域设计、Service 方法、API 接口、时序图等）按领域拆分至 `docs/技术方案/` 下独立子方案文档。
> **V2.4 变更**（较 V2.3）：删除 monitor（监控告警）域，当前阶段暂不纳入。
> **V2.3 变更**（较 V2.2）：基于 PRD 业务定位和 DDD 战略设计模式重新审视领域层级——核心域仅保留 Agent（PRD 1.3 项目目标和成功指标全部围绕 Agent 生命周期）；Model 从核心域降级为支撑域（本质是外部 LLM API 端点 CRUD 管理，不产生业务差异化）；User 从支撑域调整为通用域（用户管理 + 对话消息均为标准化功能，非业务竞争力）；Skill/MCP/Workflow 保持支撑域（Agent 能力扩展生态，支撑核心闭环）；补充层级划分的 DDD 依据说明。
> **V2.2 变更**（较 V2.1）：补充 PRD 缺失的 8 张表（mcp_version、mcp_log、mcp_template、skill_review、skill_install_record、chat_session、chat_message、user_operation_log）；Agent 表补全 12 个缺失字段（topP/topK/频率惩罚/存在惩罚/停止词/响应格式/超时/重试/admins/version）并扩展 Agent 类型枚举；Skill/MCP/User 领域模型补全实体；补充用户端后端 API（对话/个人中心）；技术栈补全 WebSocket/SSE/MCP Client/ELK/AntV G6；修正第 3 章全部编号。
> **V2.1 变更**（较 V2.0）：删除独立的 resource 域，AgentResourceBinding 实体归入 Agent 聚合内（DDD 视角：绑定是 Agent 资源配置行为，非独立业务领域）；绑定 API 迁移至 `/api/agent/{agentId}/resource` 子路径；错误码/子方案/实现顺序同步调整。
> **V2.0 变更**：新增 RBAC 权限管理域（独立于 user）；新增首页仪表盘（home）和系统配置（system_config）域；拆分 permission 为 permission_resource + permission_action + role_permission（含 grantType）；model 表删除价格/配额/速率限制列，新增 inputTypes/outputTypes；user 表扩展 MFA、登录追踪、来源等字段；user_role 新增 assignType/assignTime/expireTime。

---

## 1. 目标与范围

### 1.1 目标

为 GAgentManager 企业级 Agent 管理平台定义全局技术架构，包括：
- 技术栈选型与版本约定
- 六层架构（facade / client / domain / infra / application / adapter）的包结构规范
- 业务领域划分与聚合边界
- 数据库全景设计
- 全局非功能设计（认证、权限、审计、异常处理）

### 1.2 范围

| 范围内 | 范围外 |
|-------|--------|
| 后端 Java/Spring Boot 六层架构设计（管理端 + 用户端） | 前端 React 实现细节 |
| 全局技术栈与包结构约定 | DevOps / K8s 部署方案 |
| 数据库表结构全景设计 | ELK / Prometheus / Grafana 运维部署 |
| 全局公共组件设计（认证、异常、审计） | 第三方 Skill 市场集成 |
| 用户端后端：登录/找回密码/个人中心/Agent 对话会话/消息流式输出/附件上传 | 对话实时 WebSocket 推送实现细节 |

### 1.3 核心共识

基于设计阶段确认的设计决策：

| 决策项 | 选型 |
|-------|------|
| 架构分层 | 六层（facade / client / domain / infra / application / adapter） |
| ORM 框架 | MyBatis Plus |
| AI 调用抽象 | Spring AI + Spring AI Alibaba（统一 LLM 调用层） |
| 认证体系 | Phase 1：Spring Security + JWT；Phase 3：OAuth2/SSO |
| 文档范围 | 仅后端 |
| 子方案拆分 | 按领域拆分为独立技术方案 |
| Phase 1 非功能 | 权限控制 + 操作审计 |
| 工作流引擎 | Phase 1 不纳入 |

---

## 2. 架构设计（代码结构）

### 2.1 六层依赖关系

```
adapter → application → domain → infra
              ↓
           client ← facade
```

- **adapter**：REST Controller，接收 HTTP 请求，调用 application 层 Service
- **application**：CommandService / QueryService，编排领域动作与持久化
- **domain**：聚合根、实体、值对象、Repository/Gateway 接口、领域事件
- **infra**：MyBatis Plus Entity / Mapper、Repository/Gateway 实现、公共组件
- **client**：Param、DTO、VO（对外数据契约）
- **facade**：Result、DomainEventDTO、DomainEventPublisher、CommonRequest

### 2.2 包结构

包前缀：`com.{groupId}.gagentmanager`（groupId 待定，以下用 `xxx` 占位）

#### 2.2.1 全局公共包

| 层 | 领域 | 包 | 职责 |
|---|------|---|------|
| facade | common | `xxx.gagentmanager.facade.common` | Result、CommonRequest、DomainEventDTO、DomainEventPublisher、ErrorCode |
| client | common | `xxx.gagentmanager.client.common` | PageParam、PageResult、全局常量 |
| infra | common | `xxx.gagentmanager.infra.common` | 全局异常处理、MyBatis Plus 配置、Jackson 配置、加密工具 |
| adapter | config | `xxx.gagentmanager.adapter.config` | Spring Security 配置、CORS、Swagger/OpenAPI |
| adapter | common | `xxx.gagentmanager.adapter.common` | BaseController、GlobalExceptionHandler、TokenValidationFilter |
| application | common | `xxx.gagentmanager.application.common` | 操作审计切面、权限校验切面 |

#### 2.2.2 业务领域包

| 层 | 领域 | 包 | 职责 |
|---|------|---|------|
| facade | model | `xxx.gagentmanager.facade.model` | Model 领域事件 DTO、事件常量 |
| client | model | `xxx.gagentmanager.client.model` | Model Param / DTO / VO |
| domain | model | `xxx.gagentmanager.domain.model` | Model 聚合根、实体、值对象、Repository/Gateway 接口 |
| infra | model | `xxx.gagentmanager.infra.model` | Model Entity、Mapper、Repository 实现、Gateway 实现 |
| application | model | `xxx.gagentmanager.application.model` | Model CommandService / QueryService |
| adapter | model | `xxx.gagentmanager.adapter.model` | Model CommandController / QueryController |
| facade | agent | `xxx.gagentmanager.facade.agent` | Agent 领域事件 DTO、事件常量 |
| client | agent | `xxx.gagentmanager.client.agent` | Agent Param / DTO / VO |
| domain | agent | `xxx.gagentmanager.domain.agent` | Agent 聚合根、实体、值对象、Repository/Gateway 接口 |
| infra | agent | `xxx.gagentmanager.infra.agent` | Agent Entity、Mapper、Repository 实现 |
| application | agent | `xxx.gagentmanager.application.agent` | Agent CommandService / QueryService |
| adapter | agent | `xxx.gagentmanager.adapter.agent` | Agent CommandController / QueryController |
| facade | user | `xxx.gagentmanager.facade.user` | User 领域事件 DTO、事件常量 |
| client | user | `xxx.gagentmanager.client.user` | User Param / DTO / VO |
| domain | user | `xxx.gagentmanager.domain.user` | User 聚合根、Repository 接口 |
| infra | user | `xxx.gagentmanager.infra.user` | User Entity、Mapper、Repository 实现 |
| application | user | `xxx.gagentmanager.application.user` | User CommandService / QueryService |
| adapter | user | `xxx.gagentmanager.adapter.user` | User CommandController / QueryController |
| facade | rbac | `xxx.gagentmanager.facade.rbac` | RBAC 领域事件 DTO、事件常量 |
| client | rbac | `xxx.gagentmanager.client.rbac` | RBAC Param / DTO / VO |
| domain | rbac | `xxx.gagentmanager.domain.rbac` | Role/PermissionResource/PermissionAction 聚合根、Repository 接口 |
| infra | rbac | `xxx.gagentmanager.infra.rbac` | RBAC Entity、Mapper、Repository 实现 |
| application | rbac | `xxx.gagentmanager.application.rbac` | RBAC CommandService / QueryService |
| adapter | rbac | `xxx.gagentmanager.adapter.rbac` | RBAC CommandController / QueryController |
| facade | home | `xxx.gagentmanager.facade.home` | Home 领域事件 DTO |
| client | home | `xxx.gagentmanager.client.home` | Home Param / DTO / VO |
| domain | home | `xxx.gagentmanager.domain.home` | DashboardConfig 聚合根、Repository 接口 |
| infra | home | `xxx.gagentmanager.infra.home` | Home Entity、Mapper、Repository 实现 |
| application | home | `xxx.gagentmanager.application.home` | Home QueryService |
| adapter | home | `xxx.gagentmanager.adapter.home` | Home QueryController |
| facade | system_config | `xxx.gagentmanager.facade.system_config` | SystemConfig 领域事件 DTO |
| client | system_config | `xxx.gagentmanager.client.system_config` | SystemConfig Param / DTO / VO |
| domain | system_config | `xxx.gagentmanager.domain.system_config` | SystemConfig 聚合根、Repository 接口 |
| infra | system_config | `xxx.gagentmanager.infra.system_config` | SystemConfig Entity、Mapper、Repository 实现 |
| application | system_config | `xxx.gagentmanager.application.system_config` | SystemConfig CommandService / QueryService |
| adapter | system_config | `xxx.gagentmanager.adapter.system_config` | SystemConfig CommandController / QueryController |
| facade | skill | `xxx.gagentmanager.facade.skill` | Skill 领域事件 DTO、事件常量 |
| client | skill | `xxx.gagentmanager.client.skill` | Skill Param / DTO / VO |
| domain | skill | `xxx.gagentmanager.domain.skill` | Skill 聚合根、Repository/Gateway 接口 |
| infra | skill | `xxx.gagentmanager.infra.skill` | Skill Entity、Mapper、Repository 实现 |
| application | skill | `xxx.gagentmanager.application.skill` | Skill CommandService / QueryService |
| adapter | skill | `xxx.gagentmanager.adapter.skill` | Skill CommandController / QueryController |
| facade | mcp | `xxx.gagentmanager.facade.mcp` | MCP 领域事件 DTO、事件常量 |
| client | mcp | `xxx.gagentmanager.client.mcp` | MCP Param / DTO / VO |
| domain | mcp | `xxx.gagentmanager.domain.mcp` | MCP 聚合根、Repository/Gateway 接口 |
| infra | mcp | `xxx.gagentmanager.infra.mcp` | MCP Entity、Mapper、Repository 实现 |
| application | mcp | `xxx.gagentmanager.application.mcp` | MCP CommandService / QueryService |
| adapter | mcp | `xxx.gagentmanager.adapter.mcp` | MCP CommandController / QueryController |
| facade | workflow | `xxx.gagentmanager.facade.workflow` | Workflow 领域事件 DTO、事件常量 |
| client | workflow | `xxx.gagentmanager.client.workflow` | Workflow Param / DTO / VO |
| domain | workflow | `xxx.gagentmanager.domain.workflow` | Workflow 聚合根、Repository/Gateway 接口 |
| infra | workflow | `xxx.gagentmanager.infra.workflow` | Workflow Entity、Mapper、Repository 实现 |
| application | workflow | `xxx.gagentmanager.application.workflow` | Workflow CommandService / QueryService |
| adapter | workflow | `xxx.gagentmanager.adapter.workflow` | Workflow CommandController / QueryController |
| facade | audit | `xxx.gagentmanager.facade.audit` | 审计领域事件 DTO |
| client | audit | `xxx.gagentmanager.client.audit` | 审计日志 DTO / VO |
| domain | audit | `xxx.gagentmanager.domain.audit` | AuditLog 实体、Repository 接口 |
| infra | audit | `xxx.gagentmanager.infra.audit` | AuditLog Entity、Mapper、Repository 实现 |
| application | audit | `xxx.gagentmanager.application.audit` | AuditLog QueryService |
| adapter | audit | `xxx.gagentmanager.adapter.audit` | AuditLog QueryController |

---

## 3. 领域模型设计

### 3.1 业务层级划分

PRD 1.3 项目目标明确指出产品定位是「统一的 Agent 管理平台」，成功指标围绕 Agent 发布效率、运行效率和用户满意度。据此按 DDD 战略设计模式划分领域层级：

| 层级 | 业务领域 | 说明 | 对应 PRD |
|-----|---------|------|---------|
| 核心域 | **agent** | Agent 全生命周期管理 + 资源绑定 + 版本控制 | 4.1.1 |
| 支撑域 | **skill** | Skill 商店生态（发现/安装/评价/版本） | 4.1.5 |
| 支撑域 | **mcp** | MCP 服务管理（连接/日志/模板/版本） | 4.1.6 |
| 支撑域 | **workflow** | 工作流定义与 Agent 工具化集成 | 4.1.1.4 |
| 支撑域 | **model** | LLM 模型注册与 API 配置管理 | 4.1.7 |
| 通用域 | **user** | 用户全生命周期管理 + 对话会话 + 消息 | 4.1.2 / 4.2.2 |
| 通用域 | **rbac** | 角色、权限资源、用户-角色关联（RBAC） | 4.1.4 |
| 通用域 | **home** | 首页仪表盘、通知中心 | 4.1.3 |
| 通用域 | **system_config** | 系统参数配置 | 4.2.1 系统配置 |
| 通用域 | **audit** | 操作审计日志 | 4.1.2 用户行为审计 |

### 3.2 模型管理（model）

> 详细技术方案：见 `docs/技术方案/2026-04-28_模型管理-技术方案.md`（待产出）

**聚合设计**：
- **Model（聚合根）**：LLM 模型配置，包含基本信息、连接配置、参数配置、能力标签、输入/输出类型、状态
- **AgentModelBinding（实体）**：Agent 与模型的绑定关系，归属 Agent 聚合

**领域动作概要**：`create`、`update`、`delete`、`enable`、`disable`、`testConnectivity`

### 3.3 Agent 管理（agent）

> 详细技术方案：待产出

**聚合设计**：
- **Agent（聚合根）**：Agent 全生命周期，包含基础配置、参数配置、版本信息、管理员列表、资源绑定关系
- **AgentVersion（实体）**：Agent 版本记录（语义化版本、配置快照、差异对比）
- **AgentTemplate（实体）**：Agent 模板
- **AgentResourceBinding（实体）**：Agent 与模型/Skill/MCP/工作流的绑定关系（绑定ID、资源类型、资源ID、是否默认、排序、配置）
- **AgentConfig（值对象）**：Agent 运行时参数（温度、最大 Token、Top-P、Top-K、频率惩罚、存在惩罚、停止词序列、响应格式、超时、重试次数、系统提示词）

**领域动作概要**：`create`、`update`、`delete`、`publish`、`deploy`、`start`、`stop`、`rollback`、`import`、`export`、`compareVersions`、`bindResource`、`unbindResource`、`updateResourceConfig`

### 3.4 用户管理（user）

> 详细技术方案：待产出

**聚合设计**：
- **User（聚合根）**：用户基本信息、状态、认证信息、MFA、登录记录、分组
- **UserGroup（实体）**：用户分组（支持层级结构）
- **UserGroupMember（实体）**：用户-分组关联
- **UserOperationLog（实体）**：用户管理操作记录
- **ChatSession（聚合根）**：用户对话会话（会话标题、消息数、关联 Agent）
- **ChatMessage（实体）**：对话消息记录（内容、思维链、附件、网页预览、Token 消耗）

**领域动作概要**：`create`、`activate`、`deactivate`、`delete`、`resign`、`resetPassword`、`updateProfile`、`createSession`、`deleteSession`、`renameSession`、`sendMessage`、`stopReply`

### 3.5 RBAC 管理（rbac）

> 详细技术方案：待产出

**聚合设计**：
- **Role（聚合根）**：角色定义（角色编码、名称、描述、系统内置标识、启用状态）
- **PermissionResource（实体）**：权限资源定义（模块、菜单、按钮、接口，支持树形层级）
- **PermissionAction（实体）**：权限操作定义（read、write、delete、admin 等）
- **PermissionTemplate（实体）**：权限模板
- **RolePermission（实体）**：角色-权限关联（resourceId + actionId + grantType）
- **UserRole（实体）**：用户-角色关联（userId + roleId + assignType + assignTime + expireTime）

**领域动作概要**：`createRole`、`updateRole`、`deleteRole`、`enableRole`、`disableRole`、`copyRole`、`assignPermission`、`revokePermission`、`assignUserToRole`、`removeUserFromRole`、`batchAssignUsersToRole`

### 3.6 Skill 管理（skill）

> 详细技术方案：待产出

**聚合设计**：
- **Skill（聚合根）**：Skill 元数据、版本、分类、状态
- **SkillVersion（实体）**：Skill 版本记录
- **SkillReview（实体）**：Skill 评价/评论
- **SkillInstallRecord（实体）**：Skill 安装记录

**领域动作概要**：`install`、`update`、`uninstall`、`publish`、`review`

### 3.7 MCP 管理（mcp）

> 详细技术方案：待产出

**聚合设计**：
- **McpService（聚合根）**：MCP 服务配置、连接参数、状态
- **McpVersion（实体）**：MCP 版本记录（语义化版本、配置快照、版本标签）
- **McpLog（实体）**：MCP 连接与交互日志
- **McpTemplate（实体）**：MCP 预置配置模板

**领域动作概要**：`create`、`update`、`delete`、`testConnection`、`enable`、`disable`、`publishVersion`、`rollbackVersion`

### 3.8 工作流管理（workflow）

> 详细技术方案：待产出

**聚合设计**：
- **Workflow（聚合根）**：工作流定义、节点配置、状态
- **WorkflowNode（实体）**：工作流节点定义

**领域动作概要**：`create`、`update`、`delete`、`publish`、`offline`

### 3.9 首页仪表盘（home）

> 详细技术方案：待产出

**聚合设计**：
- **DashboardConfig（聚合根）**：首页组件配置（组件类型、位置、大小、适用角色、刷新间隔）
- **Notice（实体）**：通知中心记录（标题、内容、类型、级别、目标用户、过期时间）

**领域动作概要**：`queryDashboardConfig`、`updateDashboardConfig`、`queryNotices`、`markNoticeRead`

### 3.10 系统配置（system_config）

> 详细技术方案：待产出

**聚合设计**：
- **SystemConfig（聚合根）**：系统参数配置（key-value、类型、是否公开、是否可修改）

**领域动作概要**：`getConfig`、`updateConfig`、`batchUpdateConfig`

### 3.11 审计日志（audit）

> 详细技术方案：待产出

**聚合设计**：
- **AuditLog（实体）**：操作审计记录（操作人、操作时间、操作对象、操作类型、操作结果）

---

## 4. 应用层设计

### 4.1 业务模块划分

与 3.1 业务层级划分一致，每个业务领域对应一组 CommandService / QueryService。

| 应用模块 | 对应领域 | Service 类型 | 说明 |
|---------|---------|-------------|------|
| model | 模型管理 | CommandService + QueryService | 模型 CRUD、启停、连通性测试 |
| agent | Agent 管理 | CommandService + QueryService | Agent 全生命周期管理 |
| user | 用户管理 | CommandService + QueryService | 用户 CRUD、状态管理、密码重置、批量导入导出、对话会话、消息流式输出、个人中心 |
| rbac | 权限管理 | CommandService + QueryService | 角色 CRUD、权限矩阵配置、用户-角色关联、权限缓存 |
| skill | Skill 管理 | CommandService + QueryService | Skill 安装/更新/卸载 |
| mcp | MCP 管理 | CommandService + QueryService | MCP 服务 CRUD、连通性测试 |
| workflow | 工作流管理 | CommandService + QueryService | 工作流 CRUD、发布/下线 |
| home | 首页仪表盘 | QueryService | 仪表盘数据查询、通知中心 |
| system_config | 系统配置 | CommandService + QueryService | 系统参数读写 |
| audit | 审计日志 | QueryService | 审计日志查询 |

### 4.2 Service 设计规范

各业务模块的 Service 遵循统一规范：

```
{Domain}CommandService：写操作（CUD），编排领域动作 + 持久化
{Domain}QueryService：  读操作（R），查询 + 组装 VO
```

**方法命名约定**：
- `create{Entity}(param, operatorId)`：创建
- `update{Entity}(param, operatorId)`：更新
- `delete{Entity}(id, operatorId)`：删除
- `{action}{Entity}(id, ... , operatorId)`：业务动作（如 enableModel）
- `query{Entity}ById(id)`：按 ID 查询
- `query{Entity}List(param)`：列表查询（分页）

> 每个 Service 的详细方法清单、入参/出参、时序图在各领域子方案文档中定义。

---

## 5. 控制器/Adapter 层设计

### 5.1 业务模块划分

| Controller 模块 | 对应应用模块 | URL 前缀 |
|----------------|-------------|---------|
| ModelCommandController / ModelQueryController | model | `/api/model` |
| AgentCommandController / AgentQueryController | agent | `/api/agent` |
| UserCommandController / UserQueryController | user | `/api/user` |
| RbacCommandController / RbacQueryController | rbac | `/api/rbac` |
| SkillCommandController / SkillQueryController | skill | `/api/skill` |
| McpCommandController / McpQueryController | mcp | `/api/mcp` |
| WorkflowCommandController / WorkflowQueryController | workflow | `/api/workflow` |
| HomeQueryController | home | `/api/home` |
| SystemConfigCommandController / SystemConfigQueryController | system_config | `/api/system-config` |
| AuditQueryController | audit | `/api/audit` |
| AuthController | user（认证） | `/api/auth` |

### 5.2 接口约定（强制）

- **HTTP 方法**：仅允许 `GET`（查询）、`POST`（增删改）
- **请求格式**：`Content-Type: application/json`
- **响应格式**：统一 `Result<T>` 包装
  ```json
  {
    "code": 200,
    "message": "success",
    "data": { ... }
  }
  ```
- **分页查询**：GET 请求携带 `pageNo`、`pageSize` 查询参数
- **鉴权**：除 `/api/auth/login`、`/api/auth/register` 外，所有接口需要 JWT Token

> 每个接口的详细路径、入参 JSON、返回值 JSON、时序图在各领域子方案文档中定义。

---

## 6. 数据库设计

### 6.1 命名约定

- 表名：小写下划线，如 `model`、`agent`、`user_role`
- 字段名：小写下划线，如 `model_code`、`base_url`
- 主键：`id BIGINT NOT NULL AUTO_INCREMENT`
- 业务编号：`num VARCHAR` + 唯一索引（对外展示用）
- 创建人：`create_no VARCHAR(64)`
- 更新人：`update_no VARCHAR(64)`
- 创建时间：`create_time DATETIME(3) NOT NULL`
- 更新时间：`update_time DATETIME(3) NOT NULL`
- 逻辑删除：`deleted TINYINT(1) NOT NULL DEFAULT 0`

### 6.2 表全景图

| 序号 | 表名 | 对应领域/聚合 | 说明 | Phase |
|-----|------|-------------|------|-------|
| 1 | `user` | user / User | 用户基本信息 | Phase 1 |
| 2 | `role` | rbac / Role | 角色定义（RBAC） | Phase 1 |
| 3 | `permission_resource` | rbac / PermissionResource | 权限资源定义（模块/菜单/按钮/接口） | Phase 1 |
| 4 | `permission_action` | rbac / PermissionAction | 权限操作定义（read/write/delete/admin） | Phase 1 |
| 5 | `role_permission` | rbac / RolePermission | 角色-权限关联（含 grantType 允许/拒绝） | Phase 1 |
| 6 | `user_role` | rbac | 用户-角色关联（含分配方式、过期时间） | Phase 1 |
| 7 | `user_group` | user / UserGroup | 用户分组 | Phase 2 |
| 8 | `user_group_member` | user | 用户-分组关联 | Phase 2 |
| 9 | `permission_template` | rbac / PermissionTemplate | 权限模板 | Phase 2 |
| 10 | `model` | model / Model | LLM 模型配置 | Phase 2 |
| 11 | `agent` | agent / Agent | Agent 基本信息 | Phase 2 |
| 12 | `agent_version` | agent / AgentVersion | Agent 版本记录 | Phase 2 |
| 13 | `agent_template` | agent / AgentTemplate | Agent 模板 | Phase 3 |
| 14 | `agent_resource_binding` | agent / AgentResourceBinding | Agent-资源绑定 | Phase 2 |
| 15 | `skill` | skill / Skill | Skill 元数据 | Phase 3 |
| 16 | `skill_version` | skill / SkillVersion | Skill 版本记录 | Phase 3 |
| 17 | `skill_review` | skill / SkillReview | Skill 评价/评论 | Phase 3 |
| 18 | `skill_install_record` | skill / SkillInstallRecord | Skill 安装记录 | Phase 3 |
| 19 | `mcp_service` | mcp / McpService | MCP 服务配置 | Phase 2 |
| 20 | `mcp_version` | mcp / McpVersion | MCP 版本记录 | Phase 2 |
| 21 | `mcp_log` | mcp / McpLog | MCP 连接与交互日志 | Phase 2 |
| 22 | `mcp_template` | mcp / McpTemplate | MCP 预置配置模板 | Phase 3 |
| 23 | `workflow` | workflow / Workflow | 工作流定义 | Phase 3 |
| 24 | `workflow_node` | workflow / WorkflowNode | 工作流节点 | Phase 3 |
| 25 | `audit_log` | audit / AuditLog | 操作审计日志 | Phase 1 |
| 26 | `user_operation_log` | user / UserOperationLog | 用户管理操作日志 | Phase 1 |
| 27 | `system_config` | system_config / SystemConfig | 系统参数配置 | Phase 1 |
| 28 | `notice` | home / Notice | 通知中心记录 | Phase 2 |
| 29 | `chat_session` | user / ChatSession | 用户对话会话（用户端） | Phase 2 |
| 30 | `chat_message` | user / ChatMessage | 对话消息记录（含思维链、附件、网页预览） | Phase 2 |

### 6.3 Phase 1 核心表 DDL

#### 6.3.1 user 表

```sql
CREATE TABLE `user` (
    `id`                BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`               VARCHAR(64)     NOT NULL                COMMENT '用户编号',
    `username`          VARCHAR(30)     NOT NULL                COMMENT '登录用户名',
    `password_hash`     VARCHAR(256)    NOT NULL                COMMENT '密码哈希',
    `real_name`         VARCHAR(50)     NOT NULL                COMMENT '真实姓名',
    `nickname`          VARCHAR(20)     DEFAULT NULL            COMMENT '昵称',
    `phone`             VARCHAR(11)     DEFAULT NULL            COMMENT '手机号',
    `email`             VARCHAR(128)    NOT NULL                COMMENT '邮箱地址',
    `source`            VARCHAR(16)     NOT NULL DEFAULT 'MANUAL' COMMENT '来源：MANUAL/IMPORT/SSO/INVITE/API',
    `status`            VARCHAR(16)     NOT NULL DEFAULT 'ENABLED' COMMENT '状态：ENABLED/DISABLED/RESIGNED/DELETED',
    `department`        VARCHAR(128)    DEFAULT NULL            COMMENT '所属部门',
    `avatar`            VARCHAR(256)    DEFAULT NULL            COMMENT '头像URL',
    `notes`             VARCHAR(500)    DEFAULT NULL            COMMENT '备注',
    `mfa_enabled`       TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '是否启用双因素认证',
    `last_login_time`   DATETIME(3)     DEFAULT NULL            COMMENT '最近登录时间',
    `last_login_ip`     VARCHAR(64)     DEFAULT NULL            COMMENT '最近登录IP',
    `login_fail_count`  INT             NOT NULL DEFAULT 0      COMMENT '连续登录失败次数',
    `expire_time`       DATETIME(3)     DEFAULT NULL            COMMENT '账号过期时间',
    `create_no`         VARCHAR(64)     DEFAULT NULL            COMMENT '创建人',
    `update_no`         VARCHAR(64)     DEFAULT NULL            COMMENT '更新人',
    `create_time`       DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `update_time`       DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    `deleted`           TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    UNIQUE KEY `uk_username` (`username`, `deleted`),
    UNIQUE KEY `uk_email` (`email`, `deleted`),
    KEY `idx_phone` (`phone`),
    KEY `idx_status` (`status`),
    KEY `idx_source` (`source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

#### 6.3.2 role 表

```sql
CREATE TABLE `role` (
    `id`            BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`           VARCHAR(64)     NOT NULL                COMMENT '角色编号',
    `role_code`     VARCHAR(30)     NOT NULL                COMMENT '角色编码',
    `role_name`     VARCHAR(50)     NOT NULL                COMMENT '角色名称',
    `description`   VARCHAR(500)    DEFAULT NULL            COMMENT '描述',
    `is_system`     TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '是否系统内置（内置角色不可删除）',
    `is_enabled`    TINYINT(1)      NOT NULL DEFAULT 1      COMMENT '是否启用（禁用后不可用于新用户分配）',
    `create_no`     VARCHAR(64)     DEFAULT NULL            COMMENT '创建人',
    `update_no`     VARCHAR(64)     DEFAULT NULL            COMMENT '更新人',
    `create_time`   DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `update_time`   DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    `deleted`       TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    UNIQUE KEY `uk_role_code` (`role_code`, `deleted`),
    UNIQUE KEY `uk_role_name` (`role_name`, `deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';
```

#### 6.3.3 permission_resource 表

```sql
CREATE TABLE `permission_resource` (
    `id`            BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`           VARCHAR(64)     NOT NULL                COMMENT '资源编号',
    `resource_code` VARCHAR(64)     NOT NULL                COMMENT '资源编码（如 agent、user、skill）',
    `resource_name` VARCHAR(128)    NOT NULL                COMMENT '资源名称',
    `resource_type` VARCHAR(16)     NOT NULL                COMMENT '资源类型：MODULE/MENU/BUTTON/API',
    `parent_id`     BIGINT          DEFAULT NULL            COMMENT '父资源ID（支持树形层级）',
    `sort_order`    INT             NOT NULL DEFAULT 0      COMMENT '排序序号',
    `create_time`   DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `update_time`   DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    `deleted`       TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    UNIQUE KEY `uk_resource_code` (`resource_code`, `deleted`),
    KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限资源表';
```

#### 6.3.4 permission_action 表

```sql
CREATE TABLE `permission_action` (
    `id`            BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`           VARCHAR(64)     NOT NULL                COMMENT '操作编号',
    `action_code`   VARCHAR(32)     NOT NULL                COMMENT '操作编码（如 read、write、delete、admin）',
    `action_name`   VARCHAR(64)     NOT NULL                COMMENT '操作名称',
    `description`   VARCHAR(512)    DEFAULT NULL            COMMENT '描述',
    `create_time`   DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `update_time`   DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    `deleted`       TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    UNIQUE KEY `uk_action_code` (`action_code`, `deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限操作表';
```

#### 6.3.5 user_role 表

```sql
CREATE TABLE `user_role` (
    `id`            BIGINT      NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`           VARCHAR(64) NOT NULL                COMMENT '关联编号',
    `user_id`       BIGINT      NOT NULL                COMMENT '用户 ID',
    `role_id`       BIGINT      NOT NULL                COMMENT '角色 ID',
    `assign_type`   VARCHAR(16) NOT NULL DEFAULT 'DIRECT' COMMENT '分配方式：DIRECT（直接分配）/INHERITED（从用户组继承）',
    `assign_time`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '分配时间',
    `assign_user`   VARCHAR(64) DEFAULT NULL            COMMENT '分配操作人',
    `expire_time`   DATETIME(3) DEFAULT NULL            COMMENT '过期时间（空表示永久有效）',
    `create_no`     VARCHAR(64) DEFAULT NULL            COMMENT '创建人',
    `create_time`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
    KEY `idx_role_id` (`role_id`),
    KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户-角色关联表';
```

> **注意**：user_role 表需要添加 `deleted` 列以支持逻辑删除，或在 UNIQUE KEY 中排除已删除记录。

#### 6.3.6 role_permission 表

```sql
CREATE TABLE `role_permission` (
    `id`              BIGINT      NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`             VARCHAR(64) NOT NULL                COMMENT '关联编号',
    `role_id`         BIGINT      NOT NULL                COMMENT '角色 ID',
    `resource_id`     BIGINT      NOT NULL                COMMENT '权限资源 ID',
    `action_id`       BIGINT      NOT NULL                COMMENT '权限操作 ID',
    `permission_code` VARCHAR(128)NOT NULL                COMMENT '权限编码（格式：resourceCode:actionCode）',
    `grant_type`      VARCHAR(8)  NOT NULL DEFAULT 'ALLOW' COMMENT '授权类型：ALLOW（允许）/DENY（拒绝）',
    `create_no`       VARCHAR(64) DEFAULT NULL            COMMENT '创建人',
    `create_time`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `deleted`         TINYINT(1)  NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    UNIQUE KEY `uk_role_resource_action` (`role_id`, `resource_id`, `action_id`, `deleted`),
    KEY `idx_resource_id` (`resource_id`),
    KEY `idx_action_id` (`action_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色-权限关联表';
```

#### 6.3.7 audit_log 表

```sql
CREATE TABLE `audit_log` (
    `id`            BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`           VARCHAR(64)     NOT NULL                COMMENT '审计编号',
    `operator_id`   BIGINT          NOT NULL                COMMENT '操作人 ID',
    `operator_name` VARCHAR(128)    DEFAULT NULL            COMMENT '操作人名称',
    `resource_type` VARCHAR(32)     NOT NULL                COMMENT '资源类型（model、agent、user 等）',
    `resource_id`   BIGINT          DEFAULT NULL            COMMENT '资源 ID',
    `action`        VARCHAR(32)     NOT NULL                COMMENT '操作类型（create、update、delete、enable 等）',
    `detail`        JSON            DEFAULT NULL            COMMENT '操作详情（变更前后值）',
    `ip_address`    VARCHAR(64)     DEFAULT NULL            COMMENT 'IP 地址',
    `user_agent`    VARCHAR(512)    DEFAULT NULL            COMMENT 'User-Agent',
    `result`        VARCHAR(16)     NOT NULL                COMMENT '结果：SUCCESS/FAIL',
    `error_msg`     VARCHAR(1024)   DEFAULT NULL            COMMENT '错误信息',
    `create_time`   DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`),
    KEY `idx_operator_id` (`operator_id`),
    KEY `idx_resource` (`resource_type`, `resource_id`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作审计日志表';
```

#### 6.3.8 model 表

```sql
CREATE TABLE `model` (
    `id`                  BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`                 VARCHAR(64)     NOT NULL                COMMENT '模型编号',
    `model_code`          VARCHAR(64)     NOT NULL                COMMENT '模型编码',
    `model_name`          VARCHAR(50)     NOT NULL                COMMENT '模型名称',
    `provider`            VARCHAR(32)     NOT NULL                COMMENT '提供商',
    `api_type`            VARCHAR(32)     NOT NULL                COMMENT 'API类型',
    `description`         VARCHAR(500)    DEFAULT NULL            COMMENT '描述',
    `category`            VARCHAR(64)     DEFAULT NULL            COMMENT '分类/分组',
    `sort_order`          INT             NOT NULL DEFAULT 0      COMMENT '排序序号（数值越小越靠前）',

    `api_key`             VARCHAR(512)    NOT NULL                COMMENT 'API Key（加密存储）',
    `base_url`            VARCHAR(256)    NOT NULL                COMMENT 'API端点地址',
    `timeout`             INT             NOT NULL DEFAULT 30     COMMENT '超时时间（秒）',
    `retry_count`         INT             NOT NULL DEFAULT 3      COMMENT '重试次数',

    `max_tokens`          INT             NOT NULL DEFAULT 4096   COMMENT '最大Token数上限',
    `min_temperature`     DECIMAL(3,2)    NOT NULL DEFAULT 0.00   COMMENT '温度下限',
    `max_temperature`     DECIMAL(3,2)    NOT NULL DEFAULT 2.00   COMMENT '温度上限',
    `default_temperature` DECIMAL(3,2)    NOT NULL DEFAULT 1.00   COMMENT '默认温度',
    `default_top_p`       DECIMAL(3,2)    DEFAULT 1.00            COMMENT '默认Top-P',
    `default_top_k`       INT             DEFAULT 40              COMMENT '默认Top-K',

    `capabilities`        JSON            NOT NULL                COMMENT '能力标签（对话、补全、函数调用、工具调用、多模态、JSON输出、Structured Output）',
    `input_types`         JSON            NOT NULL                COMMENT '支持的输入类型（文本、图片、音频、视频）',
    `output_types`        JSON            NOT NULL                COMMENT '支持的输出类型（文本、JSON、图片）',

    `status`              VARCHAR(16)     NOT NULL DEFAULT 'ENABLED' COMMENT '状态：ENABLED/DISABLED/ERROR',
    `connectivity_status` VARCHAR(16)     NOT NULL DEFAULT 'UNTESTED' COMMENT '连通性状态',
    `last_test_time`      DATETIME(3)     DEFAULT NULL            COMMENT '最后测试时间',
    `test_error_message`  VARCHAR(1024)   DEFAULT NULL            COMMENT '测试错误信息',

    `create_no`           VARCHAR(64)     DEFAULT NULL            COMMENT '创建人',
    `update_no`           VARCHAR(64)     DEFAULT NULL            COMMENT '更新人',
    `create_time`         DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `update_time`         DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    `deleted`             TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    UNIQUE KEY `uk_model_code` (`model_code`, `deleted`),
    UNIQUE KEY `uk_model_name` (`model_name`, `deleted`),
    KEY `idx_provider` (`provider`),
    KEY `idx_status` (`status`),
    KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='大语言模型配置表';
```

#### 6.3.9 agent 表

```sql
CREATE TABLE `agent` (
    `id`                BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`               VARCHAR(64)     NOT NULL                COMMENT 'Agent编号',
    `agent_code`        VARCHAR(64)     NOT NULL                COMMENT 'Agent编码',
    `agent_name`        VARCHAR(50)     NOT NULL                COMMENT 'Agent名称',
    `agent_type`        VARCHAR(16)     NOT NULL                COMMENT 'Agent类型：CHAT/WORKFLOW/ANALYSIS/AUTOMATION/HYBRID',
    `description`       VARCHAR(500)    DEFAULT NULL            COMMENT '描述',
    `icon_url`          VARCHAR(256)    DEFAULT NULL            COMMENT '图标URL',
    `tags`              JSON            DEFAULT NULL            COMMENT '标签',
    `admins`            JSON            DEFAULT NULL            COMMENT 'Agent管理员用户列表（默认包含创建人）',

    `status`            VARCHAR(16)     NOT NULL DEFAULT 'DRAFT' COMMENT '状态：DRAFT/PUBLISHED/ONLINE/OFFLINE/ABNORMAL/PUBLISHING',
    `version`           VARCHAR(16)     NOT NULL DEFAULT 'V1.0.0' COMMENT '当前版本号',

    `system_prompt`     TEXT            DEFAULT NULL            COMMENT '系统提示词',
    `temperature`       DECIMAL(3,2)    DEFAULT 1.00            COMMENT '温度',
    `max_tokens`        INT             DEFAULT 4096            COMMENT '最大Token数',
    `top_p`             DECIMAL(3,2)    DEFAULT 1.00            COMMENT 'Top-P',
    `top_k`             INT             DEFAULT 40              COMMENT 'Top-K',
    `frequency_penalty` DECIMAL(3,2)    DEFAULT 0.00            COMMENT '频率惩罚',
    `presence_penalty`  DECIMAL(3,2)    DEFAULT 0.00            COMMENT '存在惩罚',
    `stop_sequences`    JSON            DEFAULT NULL            COMMENT '停止词序列',
    `response_format`   VARCHAR(32)     DEFAULT 'text'          COMMENT '响应格式：text/json_object/structured_output',
    `timeout_seconds`   INT             DEFAULT 60              COMMENT '请求超时时间（秒）',
    `retry_count`       INT             DEFAULT 3               COMMENT '失败重试次数',

    `create_no`         VARCHAR(64)     DEFAULT NULL            COMMENT '创建人',
    `update_no`         VARCHAR(64)     DEFAULT NULL            COMMENT '更新人',
    `create_time`       DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `update_time`       DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    `deleted`           TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    UNIQUE KEY `uk_agent_code` (`agent_code`, `deleted`),
    UNIQUE KEY `uk_agent_name` (`agent_name`, `deleted`),
    KEY `idx_status` (`status`),
    KEY `idx_agent_type` (`agent_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Agent表';
```

#### 6.3.10 agent_resource_binding 表

```sql
CREATE TABLE `agent_resource_binding` (
    `id`            BIGINT      NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`           VARCHAR(64) NOT NULL                COMMENT '绑定编号',
    `agent_id`      BIGINT      NOT NULL                COMMENT 'Agent ID',
    `resource_type` VARCHAR(32) NOT NULL                COMMENT '资源类型：MODEL/SKILL/MCP/WORKFLOW',
    `resource_id`   BIGINT      NOT NULL                COMMENT '资源 ID',
    `is_default`    TINYINT(1)  NOT NULL DEFAULT 0      COMMENT '是否默认资源',
    `sort_order`    INT         NOT NULL DEFAULT 0      COMMENT '排序序号',
    `config`        JSON        DEFAULT NULL            COMMENT '绑定配置（独立参数）',
    `create_no`     VARCHAR(64) DEFAULT NULL            COMMENT '创建人',
    `create_time`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `update_no`     VARCHAR(64) DEFAULT NULL            COMMENT '更新人',
    `update_time`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    `deleted`       TINYINT(1)  NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    UNIQUE KEY `uk_agent_resource` (`agent_id`, `resource_type`, `resource_id`, `deleted`),
    KEY `idx_resource` (`resource_type`, `resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Agent-资源绑定关系表';
```

#### 6.3.11 system_config 表

```sql
CREATE TABLE `system_config` (
    `id`            BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `config_key`    VARCHAR(64)     NOT NULL                COMMENT '配置键（唯一标识）',
    `config_value`  TEXT            NOT NULL                COMMENT '配置值',
    `config_type`   VARCHAR(16)     NOT NULL DEFAULT 'STRING' COMMENT '配置类型：STRING/NUMBER/BOOLEAN/JSON',
    `description`   VARCHAR(512)    DEFAULT NULL            COMMENT '配置说明',
    `is_public`     TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '是否公开配置（前端可读取）',
    `is_modifiable` TINYINT(1)      NOT NULL DEFAULT 1      COMMENT '是否允许运行时修改',
    `update_no`     VARCHAR(64)     DEFAULT NULL            COMMENT '最后修改人',
    `update_time`   DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';
```

#### 6.3.12 notice 表

```sql
CREATE TABLE `notice` (
    `id`              BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`             VARCHAR(64)     NOT NULL                COMMENT '通知编号',
    `title`           VARCHAR(100)    NOT NULL                COMMENT '通知标题',
    `content`         VARCHAR(2000)   NOT NULL                COMMENT '通知内容',
    `type`            VARCHAR(16)     NOT NULL                COMMENT '类型：SYSTEM/TASK/VERSION',
    `severity`        VARCHAR(16)     NOT NULL DEFAULT 'INFO' COMMENT '级别：INFO/WARN/ERROR',
    `sender`          VARCHAR(64)     NOT NULL                COMMENT '发送者',
    `target_users`    JSON            DEFAULT NULL            COMMENT '目标用户列表（空表示全员）',
    `link`            VARCHAR(256)    DEFAULT NULL            COMMENT '关联链接',
    `expire_time`     DATETIME(3)     DEFAULT NULL            COMMENT '过期时间',
    `create_no`       VARCHAR(64)     DEFAULT NULL            COMMENT '创建人',
    `create_time`     DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `deleted`         TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`),
    KEY `idx_type` (`type`),
    KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';
```

#### 6.3.13 chat_session 表

```sql
CREATE TABLE `chat_session` (
    `id`                BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`               VARCHAR(64)     NOT NULL                COMMENT '会话编号',
    `user_id`           BIGINT          NOT NULL                COMMENT '用户ID',
    `agent_id`          BIGINT          NOT NULL                COMMENT 'Agent ID',
    `session_title`     VARCHAR(200)    DEFAULT NULL            COMMENT '会话标题（根据首次输入自动生成，支持手动修改）',
    `message_count`     INT             NOT NULL DEFAULT 0      COMMENT '消息总数',
    `last_message_time` DATETIME(3)     DEFAULT NULL            COMMENT '最后一条消息时间',
    `create_time`       DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '会话创建时间',
    `update_time`       DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    `deleted`           TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    KEY `idx_user_agent` (`user_id`, `agent_id`),
    KEY `idx_last_message_time` (`user_id`, `last_message_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户对话会话表';
```

#### 6.3.14 chat_message 表

```sql
CREATE TABLE `chat_message` (
    `id`                BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`               VARCHAR(64)     NOT NULL                COMMENT '消息编号',
    `session_id`        BIGINT          NOT NULL                COMMENT '所属会话ID',
    `role`              VARCHAR(16)     NOT NULL                COMMENT '消息角色：USER/ASSISTANT/SYSTEM',
    `content`           TEXT            NOT NULL                COMMENT '消息正文（支持Markdown）',
    `thinking_chain`    TEXT            DEFAULT NULL            COMMENT 'Agent思维链内容',
    `attachments`       JSON            DEFAULT NULL            COMMENT '附件列表（fileUrl, fileName, fileSize, mimeType）',
    `web_previews`      JSON            DEFAULT NULL            COMMENT '网页预览列表（url, title, description, thumbnailUrl）',
    `used_skills`       JSON            DEFAULT NULL            COMMENT '此次回复使用的Skill列表',
    `used_model`        VARCHAR(128)    DEFAULT NULL            COMMENT '此次回复使用的模型',
    `token_usage`       INT             DEFAULT NULL            COMMENT 'Token消耗量（输入+输出）',
    `is_error`          TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '是否为错误消息',
    `create_time`       DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '消息创建时间',
    `deleted`           TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    KEY `idx_session_id` (`session_id`),
    KEY `idx_create_time` (`session_id`, `create_time`),
    KEY `idx_role` (`session_id`, `role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='对话消息表';
```

#### 6.3.15 user_operation_log 表

```sql
CREATE TABLE `user_operation_log` (
    `id`            BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`           VARCHAR(64)     NOT NULL                COMMENT '操作记录编号',
    `user_id`       BIGINT          NOT NULL                COMMENT '目标用户ID',
    `operator_id`   BIGINT          NOT NULL                COMMENT '操作人ID',
    `operator_name` VARCHAR(128)    DEFAULT NULL            COMMENT '操作人名称',
    `operation_type`VARCHAR(16)     NOT NULL                COMMENT '操作类型：CREATE/ENABLE/DISABLE/DELETE/RESIGN/RESET_PASSWORD',
    `module`        VARCHAR(32)     DEFAULT NULL            COMMENT '所属模块',
    `target_id`     BIGINT          DEFAULT NULL            COMMENT '目标对象ID',
    `target_name`   VARCHAR(256)    DEFAULT NULL            COMMENT '目标对象名称',
    `detail`        JSON            DEFAULT NULL            COMMENT '操作详情（变更前后数据）',
    `ip_address`    VARCHAR(64)     DEFAULT NULL            COMMENT 'IP地址',
    `user_agent`    VARCHAR(512)    DEFAULT NULL            COMMENT 'User-Agent',
    `status`        VARCHAR(8)      NOT NULL DEFAULT 'SUCCESS' COMMENT '结果：SUCCESS/FAIL',
    `error_message` VARCHAR(1024)   DEFAULT NULL            COMMENT '错误信息',
    `remark`        VARCHAR(500)    DEFAULT NULL            COMMENT '操作备注',
    `create_time`   DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '操作时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_operator_id` (`operator_id`),
    KEY `idx_operation_type` (`operation_type`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户管理操作日志表';
```

#### 6.3.16 mcp_version 表

```sql
CREATE TABLE `mcp_version` (
    `id`                BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`               VARCHAR(64)     NOT NULL                COMMENT '版本编号',
    `mcp_id`            BIGINT          NOT NULL                COMMENT '所属MCP服务ID',
    `version`           VARCHAR(16)     NOT NULL                COMMENT '版本号（语义化版本）',
    `version_tag`       VARCHAR(16)     NOT NULL DEFAULT 'DRAFT' COMMENT '版本标签：DRAFT/PUBLISHED/DISABLED/DEPRECATED',
    `changelog`         VARCHAR(1000)   DEFAULT NULL            COMMENT '版本变更说明',
    `config_snapshot`   JSON            NOT NULL                COMMENT '版本配置快照',
    `creator`           VARCHAR(64)     NOT NULL                COMMENT '版本创建人',
    `publish_time`      DATETIME(3)     DEFAULT NULL            COMMENT '发布时间',
    `is_current`        TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '是否为当前活跃版本',
    `create_time`       DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '版本创建时间',
    `deleted`           TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    KEY `idx_mcp_id` (`mcp_id`),
    KEY `idx_version` (`mcp_id`, `version`),
    KEY `idx_is_current` (`mcp_id`, `is_current`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MCP版本记录表';
```

#### 6.3.17 mcp_log 表

```sql
CREATE TABLE `mcp_log` (
    `id`            BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `mcp_id`        BIGINT          NOT NULL                COMMENT 'MCP服务ID',
    `log_level`     VARCHAR(8)      NOT NULL                COMMENT '日志级别：DEBUG/INFO/WARN/ERROR',
    `message`       TEXT            NOT NULL                COMMENT '日志内容',
    `request_url`   VARCHAR(512)    DEFAULT NULL            COMMENT '请求URL',
    `status_code`   INT             DEFAULT NULL            COMMENT '响应状态码',
    `response_time` INT             DEFAULT NULL            COMMENT '响应时间（毫秒）',
    `error_code`    VARCHAR(64)     DEFAULT NULL            COMMENT '错误码',
    `create_time`   DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '日志时间',
    PRIMARY KEY (`id`),
    KEY `idx_mcp_id` (`mcp_id`),
    KEY `idx_log_level` (`log_level`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MCP连接与交互日志表';
```

#### 6.3.18 mcp_template 表

```sql
CREATE TABLE `mcp_template` (
    `id`            BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`           VARCHAR(64)     NOT NULL                COMMENT '模板编号',
    `template_name` VARCHAR(50)     NOT NULL                COMMENT '模板名称',
    `description`   VARCHAR(200)    DEFAULT NULL            COMMENT '模板描述',
    `config_preset` JSON            NOT NULL                COMMENT '预置配置（URL、协议版本、认证方式等）',
    `category`      VARCHAR(32)     NOT NULL                COMMENT '分类：DATABASE/FILE_STORAGE/SEARCH/CODE_TOOL/OTHER',
    `is_official`   TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '是否官方模板',
    `use_count`     INT             NOT NULL DEFAULT 0      COMMENT '使用次数',
    `create_time`   DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `deleted`       TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    KEY `idx_category` (`category`),
    KEY `idx_is_official` (`is_official`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MCP预置配置模板表';
```

#### 6.3.19 skill_review 表

```sql
CREATE TABLE `skill_review` (
    `id`            BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`           VARCHAR(64)     NOT NULL                COMMENT '评论编号',
    `skill_id`      BIGINT          NOT NULL                COMMENT 'Skill ID',
    `user_id`       BIGINT          NOT NULL                COMMENT '评论用户ID',
    `username`      VARCHAR(64)     NOT NULL                COMMENT '评论用户名',
    `rating`        INT             NOT NULL                COMMENT '评分（1-5星）',
    `content`       VARCHAR(1000)   NOT NULL                COMMENT '评论内容',
    `is_verified`   TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '是否为已安装用户',
    `reply_count`   INT             NOT NULL DEFAULT 0      COMMENT '回复数量',
    `create_time`   DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '评论时间',
    `deleted`       TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    UNIQUE KEY `uk_skill_user` (`skill_id`, `user_id`, `deleted`),
    KEY `idx_rating` (`skill_id`, `rating`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Skill评价表';
```

#### 6.3.20 skill_install_record 表

```sql
CREATE TABLE `skill_install_record` (
    `id`                BIGINT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `num`               VARCHAR(64)     NOT NULL                COMMENT '安装记录编号',
    `skill_id`          BIGINT          NOT NULL                COMMENT 'Skill ID',
    `skill_name`        VARCHAR(128)    NOT NULL                COMMENT 'Skill名称',
    `installed_version` VARCHAR(16)     NOT NULL                COMMENT '安装的版本号',
    `install_status`    VARCHAR(16)     NOT NULL DEFAULT 'INSTALLING' COMMENT '安装状态：INSTALLING/SUCCESS/FAIL/UNINSTALLED',
    `install_user`      VARCHAR(64)     NOT NULL                COMMENT '操作人',
    `install_time`      DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '安装时间',
    `fail_reason`       VARCHAR(1024)   DEFAULT NULL            COMMENT '失败原因',
    `config_data`       JSON            DEFAULT NULL            COMMENT '安装后的配置数据',
    `bound_agents`      JSON            DEFAULT NULL            COMMENT '已绑定此Skill的Agent列表',
    `deleted`           TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_num` (`num`, `deleted`),
    KEY `idx_skill_id` (`skill_id`),
    KEY `idx_install_status` (`install_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Skill安装记录表';
```

### 6.4 Phase 1 初始化数据

```sql
-- 初始化默认角色（6种预设角色，系统内置不可删除）
INSERT INTO `role` (`num`, `role_code`, `role_name`, `description`, `is_system`, `is_enabled`, `create_no`) VALUES
('ROLE-001', 'SUPER_ADMIN', '超级管理员', '系统最高权限，拥有全部权限且不可删除', 1, 1, 'SYSTEM'),
('ROLE-002', 'ADMIN', '管理员', '系统管理员，拥有全部管理权限', 1, 1, 'SYSTEM'),
('ROLE-003', 'DEVELOPER', '开发者', '开发人员，可管理 Agent/模型', 1, 1, 'SYSTEM'),
('ROLE-004', 'DATA_SCIENTIST', '数据科学家', '可管理模型，查看审计日志', 1, 1, 'SYSTEM'),
('ROLE-005', 'USER', '普通用户', '可使用 Agent，查看模型', 1, 1, 'SYSTEM'),
('ROLE-006', 'GUEST', '访客', '只读权限', 1, 1, 'SYSTEM');

-- 初始化权限资源
INSERT INTO `permission_resource` (`num`, `resource_code`, `resource_name`, `resource_type`, `sort_order`) VALUES
('RES-001', 'agent', 'Agent管理', 'MODULE', 1),
('RES-002', 'user', '用户管理', 'MODULE', 2),
('RES-003', 'rbac', '权限管理', 'MODULE', 3),
('RES-004', 'skill', 'Skill商店', 'MODULE', 4),
('RES-005', 'mcp', 'MCP管理', 'MODULE', 5),
('RES-006', 'model', '模型管理', 'MODULE', 6),
('RES-007', 'workflow', '工作流管理', 'MODULE', 7),
('RES-008', 'system_config', '系统配置', 'MODULE', 8);

-- 初始化权限操作
INSERT INTO `permission_action` (`num`, `action_code`, `action_name`) VALUES
('ACT-001', 'read', '查看'),
('ACT-002', 'create', '新增'),
('ACT-003', 'update', '修改'),
('ACT-004', 'delete', '删除'),
('ACT-005', 'admin', '管理');

-- 初始化角色-权限关联（超级管理员拥有全部权限）
INSERT INTO `role_permission` (`num`, `role_id`, `resource_id`, `action_id`, `permission_code`, `grant_type`)
SELECT 'RP-SUPER-001', 1, id, 1, CONCAT('all', ':read'), 'ALLOW' FROM `permission_resource` UNION ALL
SELECT 'RP-SUPER-002', 1, id, 2, CONCAT('all', ':create'), 'ALLOW' FROM `permission_resource` UNION ALL
SELECT 'RP-SUPER-003', 1, id, 3, CONCAT('all', ':update'), 'ALLOW' FROM `permission_resource` UNION ALL
SELECT 'RP-SUPER-004', 1, id, 4, CONCAT('all', ':delete'), 'ALLOW' FROM `permission_resource` UNION ALL
SELECT 'RP-SUPER-005', 1, id, 5, CONCAT('all', ':admin'), 'ALLOW' FROM `permission_resource`;

-- 开发者拥有 Agent 和模型的全部权限
INSERT INTO `role_permission` (`num`, `role_id`, `resource_id`, `action_id`, `permission_code`, `grant_type`)
SELECT CONCAT('RP-DEV-', id * 10 + aid.id), 3, pr.id, aid.id, CONCAT(pr.resource_code, ':', aid.action_code), 'ALLOW'
FROM `permission_resource` pr
CROSS JOIN `permission_action` aid
WHERE pr.resource_code IN ('agent', 'model');

-- 数据科学家拥有模型管理权限
INSERT INTO `role_permission` (`num`, `role_id`, `resource_id`, `action_id`, `permission_code`, `grant_type`)
SELECT CONCAT('RP-DS-', pr.id * 10 + aid.id), 4, pr.id, aid.id, CONCAT(pr.resource_code, ':', aid.action_code), 'ALLOW'
FROM `permission_resource` pr
CROSS JOIN `permission_action` aid
WHERE pr.resource_code = 'model';

-- 普通用户拥有查看权限
INSERT INTO `role_permission` (`num`, `role_id`, `resource_id`, `action_id`, `permission_code`, `grant_type`)
SELECT CONCAT('RP-USER-', pr.id), 5, pr.id, 1, CONCAT(pr.resource_code, ':read'), 'ALLOW'
FROM `permission_resource` pr;

-- 访客拥有查看权限
INSERT INTO `role_permission` (`num`, `role_id`, `resource_id`, `action_id`, `permission_code`, `grant_type`)
SELECT CONCAT('RP-GUEST-', pr.id), 6, pr.id, 1, CONCAT(pr.resource_code, ':read'), 'ALLOW'
FROM `permission_resource` pr;

-- 初始化默认管理员用户（密码为加密后的 admin123）
INSERT INTO `user` (`num`, `username`, `password_hash`, `real_name`, `email`, `status`, `create_no`) VALUES
('USER-001', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '系统管理员', 'admin@example.com', 'ENABLED', 'SYSTEM');
INSERT INTO `user_role` (`num`, `user_id`, `role_id`, `assign_type`, `assign_time`, `assign_user`) VALUES
('UR-001', 1, 1, 'DIRECT', NOW(3), 'SYSTEM');

-- 初始化系统配置
INSERT INTO `system_config` (`config_key`, `config_value`, `config_type`, `description`, `is_public`, `is_modifiable`) VALUES
('max_agents_per_user', '50', 'NUMBER', '每个用户最大Agent数量', 0, 1),
('max_concurrent_agents', '1000', 'NUMBER', '系统最大并发Agent数', 0, 1),
('default_model_id', '', 'STRING', '默认模型ID', 0, 1),
('max_upload_file_size', '50', 'NUMBER', '最大上传文件大小（MB）', 0, 1),
('session_timeout', '60', 'NUMBER', '会话超时时间（分钟）', 0, 1),
('password_min_length', '8', 'NUMBER', '密码最小长度', 0, 1),
('password_require_upper', 'true', 'BOOLEAN', '密码是否要求大写', 0, 1),
('password_require_lower', 'true', 'BOOLEAN', '密码是否要求小写', 0, 1),
('password_require_number', 'true', 'BOOLEAN', '密码是否要求数字', 0, 1),
('password_require_special', 'true', 'BOOLEAN', '密码是否要求特殊字符', 0, 1),
('password_expire_days', '90', 'NUMBER', '密码过期天数（0表示不过期）', 0, 1),
('max_login_failures', '5', 'NUMBER', '最大登录失败次数', 0, 1),
('lock_duration', '30', 'NUMBER', '账号锁定时长（分钟）', 0, 1),
('enable_mfa', 'false', 'BOOLEAN', '是否强制MFA', 0, 1),
('enable_sso', 'false', 'BOOLEAN', '是否启用SSO', 0, 1),
('data_retention_days', '365', 'NUMBER', '数据保留天数', 0, 1);
```

---

## 7. 全局公共组件设计

### 7.1 统一响应结构

```java
public class Result<T> {
    private int code;         // 200=成功, 其他=失败
    private String message;   // 提示信息
    private T data;           // 业务数据
}

public class PageResult<T> {
    private List<T> records;  // 数据列表
    private long total;       // 总记录数
    private int pageNo;       // 当前页码
    private int pageSize;     // 每页大小
}
```

### 7.2 错误码体系

| 错误码范围 | 说明 |
|-----------|------|
| 200 | 成功 |
| 400 ~ 499 | 客户端错误（参数错误、鉴权失败、无权限） |
| 500 ~ 599 | 服务端错误（系统异常、数据库异常） |
| 1000 ~ 1999 | 业务错误码（各领域自定义错误） |

业务错误码分配：

| 范围 | 领域 |
|-----|------|
| 1001 ~ 1099 | 用户/认证（user/auth） |
| 1101 ~ 1199 | Agent（agent） |
| 1201 ~ 1299 | 模型（model） |
| 1301 ~ 1399 | Skill（skill） |
| 1401 ~ 1499 | MCP（mcp） |
| 1501 ~ 1599 | 工作流（workflow） |
| 1701 ~ 1799 | RBAC 权限管理（rbac） |
| 1801 ~ 1899 | 首页仪表盘（home） |
| 1901 ~ 1999 | 系统配置（system_config） |

### 7.3 认证与鉴权

**Phase 1 方案**：

| 组件 | 技术方案 |
|-----|---------|
| 认证 | Spring Security + JWT Token |
| Token 有效期 | Access Token 2h，Refresh Token 7d |
| 密码加密 | BCrypt |
| 多因素认证 | MFA（TOTP），Phase 1 预留，Phase 2 启用 |
| 鉴权 | 基于角色的访问控制（RBAC），通过 `@PreAuthorize` 注解；权限数据缓存至 Redis，变更后实时清除 |
| 操作人传递 | JWT Payload 中包含 userId，通过 ThreadLocal 传递 |
| 登录保护 | 连续失败次数上限，达到阈值自动锁定账号 |

### 7.4 操作审计

- 通过 **AOP 切面** 拦截所有 `POST` 写操作 Controller
- 自动记录：操作人、资源类型、资源 ID、操作类型、请求参数、响应结果、IP 地址
- 写入 `audit_log` 表（异步写入，不影响主流程性能）
- 通过 **Application Event** 机制解耦审计逻辑

### 7.5 异常处理

- **GlobalExceptionHandler** 统一捕获异常
- **BusinessException**：领域层抛出的业务异常，携带 ErrorCode
- **ValidationException**：参数校验失败
- **AuthenticationException**：认证失败
- **AuthorizationException**：权限不足

---

## 8. 模块变更清单

本蓝图文档定义的各层基础模块（Phase 1）：

| 层级 | 变更项 | 对应 Skill |
|------|--------|------------|
| facade | Result、CommonRequest、PageResult、DomainEventDTO、DomainEventPublisher、ErrorCode | impl-facade-module |
| client | PageParam、各领域基础 Param/DTO/VO | impl-client-module |
| domain | user/rbac/model/agent/audit 聚合根、实体、Repository/Gateway 接口、领域事件常量 | impl-domain-module |
| infra | 数据库 Entity、Mapper、Repository 实现、MyBatis Plus 配置、加密工具、事件发布实现 | impl-infra-module |
| application | user/rbac/model/agent/audit CommandService、QueryService、审计 AOP 切面 | impl-application-module |
| adapter | 各领域 CommandController/QueryController、AuthController、BaseController、GlobalExceptionHandler、Security 配置 | impl-adapter-module |

---

## 9. 代码分支命名

| 阶段 | 分支名 | 说明 |
|-----|--------|------|
| Phase 1 | `feature-20260428-init-foundation` | 基础框架：项目结构、认证、用户、审计 |
| Phase 2 | `feature-20260501-agent-model` | Agent（含资源绑定） + 模型 |
| Phase 3a | `feature-20260515-skill-mcp` | Skill 商店 + MCP 管理 |
| Phase 3b | `feature-20260515-workflow` | 工作流 |

---

## 10. 实现顺序

### Phase 1：基础框架

```
facade → client → domain(user/rbac/audit/system_config) → infra(user/rbac/audit/system_config) → application(user/rbac/audit/system_config) → adapter(user/rbac/audit/system_config/auth)
```

### Phase 2：核心功能

```
facade(model/agent/home) → client(model/agent/home) → domain(model/agent/home) → infra(model/agent/home) → application(model/agent/home) → adapter(model/agent/home)
```

### Phase 3：增强功能

```
facade(skill/mcp/workflow) → client(skill/mcp/workflow) → domain(skill/mcp/workflow) → infra(skill/mcp/workflow) → application(skill/mcp/workflow) → adapter(skill/mcp/workflow)
```

---

## 11. 接口与数据契约（概要）

### 11.1 通用约定

**所有接口遵循统一模式**：

| 操作 | HTTP 方法 | 路径模式 | 示例 |
|-----|----------|---------|------|
| 列表查询 | GET | `/{resource}/query/list` | `GET /api/model/query/list?pageNo=1&pageSize=10` |
| 详情查询 | GET | `/{resource}/query/detail` | `GET /api/model/query/detail?id=1` |
| 创建 | POST | `/{resource}/command/create` | `POST /api/model/command/create` |
| 更新 | POST | `/{resource}/command/update` | `POST /api/model/command/update` |
| 删除 | POST | `/{resource}/command/delete` | `POST /api/model/command/delete` |
| 业务动作 | POST | `/{resource}/command/{action}` | `POST /api/model/command/enable` |

### 11.2 各领域核心接口清单

#### 模型管理（/api/model）

| 操作 | 方法 | 路径 | 入参 | 返回值 |
|-----|------|------|------|--------|
| 列表查询 | GET | `/query/list` | pageNo, pageSize, keyword, provider, status | `Result<PageResult<ModelVO>>` |
| 详情 | GET | `/query/detail` | id | `Result<ModelVO>` |
| 创建 | POST | `/command/create` | `CreateModelParam` | `Result<Long>` |
| 更新 | POST | `/command/update` | `UpdateModelParam` | `Result<Void>` |
| 删除 | POST | `/command/delete` | id | `Result<Void>` |
| 启用 | POST | `/command/enable` | id | `Result<Void>` |
| 禁用 | POST | `/command/disable` | id | `Result<Void>` |
| 连通性测试 | POST | `/command/test` | id | `Result<TestResultVO>` |

#### Agent 管理（/api/agent）

| 操作 | 方法 | 路径 | 入参 | 返回值 |
|-----|------|------|------|--------|
| 列表查询 | GET | `/query/list` | pageNo, pageSize, keyword, status, type | `Result<PageResult<AgentVO>>` |
| 详情 | GET | `/query/detail` | id | `Result<AgentVO>` |
| 创建 | POST | `/command/create` | `CreateAgentParam` | `Result<Long>` |
| 更新 | POST | `/command/update` | `UpdateAgentParam` | `Result<Void>` |
| 删除 | POST | `/command/delete` | id | `Result<Void>` |
| 部署 | POST | `/command/deploy` | id | `Result<Void>` |
| 启动 | POST | `/command/start` | id | `Result<Void>` |
| 停止 | POST | `/command/stop` | id | `Result<Void>` |
| 回滚 | POST | `/command/rollback` | id, versionId | `Result<Void>` |

#### 认证（/api/auth）

| 操作 | 方法 | 路径 | 入参 | 返回值 |
|-----|------|------|------|--------|
| 登录 | POST | `/login` | username, password | `Result<LoginVO>` |
| 登出 | POST | `/logout` | - | `Result<Void>` |
| 刷新 Token | POST | `/refresh` | refreshToken | `Result<LoginVO>` |

#### RBAC 权限管理（/api/rbac）

| 操作 | 方法 | 路径 | 入参 | 返回值 |
|-----|------|------|------|--------|
| 角色列表 | GET | `/role/query/list` | pageNo, pageSize, keyword, isEnabled | `Result<PageResult<RoleVO>>` |
| 角色详情 | GET | `/role/query/detail` | id | `Result<RoleVO>` |
| 创建角色 | POST | `/role/command/create` | `CreateRoleParam` | `Result<Long>` |
| 更新角色 | POST | `/role/command/update` | `UpdateRoleParam` | `Result<Void>` |
| 删除角色 | POST | `/role/command/delete` | id | `Result<Void>` |
| 启用角色 | POST | `/role/command/enable` | id | `Result<Void>` |
| 禁用角色 | POST | `/role/command/disable` | id | `Result<Void>` |
| 复制角色 | POST | `/role/command/copy` | id, newRoleCode, newRoleName | `Result<Long>` |
| 角色权限矩阵 | GET | `/role/query/permissions` | roleId | `Result<PermissionMatrixVO>` |
| 配置角色权限 | POST | `/role/command/assign-permissions` | `AssignPermissionsParam` | `Result<Void>` |
| 角色关联用户 | GET | `/role/query/users` | roleId | `Result<PageResult<UserInRoleVO>>` |
| 关联用户到角色 | POST | `/role/command/assign-users` | `AssignUsersParam` | `Result<Void>` |
| 批量关联用户 | POST | `/role/command/batch-assign-users` | `BatchAssignUsersParam` | `Result<BatchResultVO>` |
| 从角色移除用户 | POST | `/role/command/remove-user` | roleId, userId | `Result<Void>` |
| 权限资源树 | GET | `/resource/query/tree` | - | `Result<List<ResourceTreeNode>>` |

#### 首页仪表盘（/api/home）

| 操作 | 方法 | 路径 | 入参 | 返回值 |
|-----|------|------|------|--------|
| 仪表盘数据 | GET | `/dashboard` | - | `Result<DashboardVO>` |
| 快捷操作 | GET | `/shortcuts` | - | `Result<List<ShortcutVO>>` |
| 通知列表 | GET | `/notices` | pageNo, pageSize, type | `Result<PageResult<NoticeVO>>` |
| 标记已读 | POST | `/notices/read` | noticeId | `Result<Void>` |
| 全局搜索 | GET | `/search` | keyword, searchScope | `Result<SearchResultVO>` |

#### 用户端对话（/api/chat）

| 操作 | 方法 | 路径 | 入参 | 返回值 |
|-----|------|------|------|--------|
| 会话列表 | GET | `/session/list` | agentId | `Result<List<SessionVO>>` |
| 创建会话 | POST | `/session/create` | agentId, sessionTitle | `Result<Long>` |
| 删除会话 | POST | `/session/delete` | sessionId | `Result<Void>` |
| 重命名会话 | POST | `/session/rename` | sessionId, sessionTitle | `Result<Void>` |
| 消息历史 | GET | `/message/history` | sessionId, pageNo, pageSize | `Result<PageResult<MessageVO>>` |
| 发送消息 | POST | `/message/send` | sessionId, content, attachments | `Result<MessageVO>`（流式输出） |
| 停止回复 | POST | `/message/stop` | sessionId | `Result<Void>` |
| 附件上传 | POST | `/attachment/upload` | multipart file | `Result<AttachmentVO>` |

#### 用户端个人中心（/api/user/profile）

| 操作 | 方法 | 路径 | 入参 | 返回值 |
|-----|------|------|------|--------|
| 个人信息 | GET | `/detail` | - | `Result<UserProfileVO>` |
| 更新信息 | POST | `/update` | realName, phone, email | `Result<Void>` |
| 修改密码 | POST | `/change-password` | oldPassword, newPassword | `Result<Void>` |
| 上传头像 | POST | `/avatar` | multipart file | `Result<Void>` |
| 开启/关闭 MFA | POST | `/mfa/toggle` | enabled | `Result<Void>` |
| 设置偏好 | POST | `/preference` | language, theme | `Result<Void>` |
| 交互历史 | GET | `/history` | pageNo, pageSize, keyword | `Result<PageResult<InteractionHistoryVO>>` |

#### 资源关联（Agent 子资源，/api/agent/{agentId}/resource）

| 操作 | 方法 | 路径 | 入参 | 返回值 |
|-----|------|------|------|--------|
| 列表查询 | GET | `/api/agent/{agentId}/resource/query/list` | resourceType | `Result<List<ResourceBindingVO>>` |
| 绑定 | POST | `/api/agent/{agentId}/resource/command/bind` | `BindResourceParam` | `Result<Long>` |
| 解绑 | POST | `/api/agent/{agentId}/resource/command/unbind` | id | `Result<Void>` |
| 更新配置 | POST | `/api/agent/{agentId}/resource/command/update-config` | `UpdateBindingParam` | `Result<Void>` |

> 各领域详细的 Param/VO JSON 结构、时序图在各领域子方案文档中定义。

---

## 12. 技术栈版本约定

| 组件 | 版本 | 说明 |
|-----|------|------|
| Java | 21 | LTS |
| Spring Boot | 3.4.x | 支持 Java 21 |
| Spring AI | 1.0.x | LLM 统一抽象层 |
| Spring AI Alibaba | 1.0.x | 国内模型适配 |
| MyBatis Plus | 3.5.x | ORM 框架 |
| MySQL | 8.x | 主数据库 |
| Redis | 7.x | 缓存 |
| Spring Security | 6.x | 认证鉴权 |
| JWT (jjwt) | 0.12.x | Token 生成与验证 |
| Maven | 3.9.x | 构建工具 |
| Lombok | 1.18.x | 简化 Java 代码 |
| Hutool | 5.8.x | 工具库 |
| Jackson | Spring Boot 内置 | JSON 序列化 |
| Knife4j | 4.x | API 文档（Swagger UI） |
| WebSocket (STOMP) | Spring Boot 内置 | 用户端 Agent 对话流式输出 |
| SSE (Server-Sent Events) | Spring Boot 内置 | 备用流式输出方案 |
| Spring AI MCP Client | 1.0.x | MCP 协议客户端 |
| ELK (Elasticsearch + Logstash + Kibana) | 8.x | 日志收集与可视化 |
| AntV G6 | 4.x | 工作流可视化编排（前端） |
| RocketMQ | 5.x | 异步处理、事件驱动（Phase 3 引入） |
| MinIO / S3 | — | 文件/模型文件存储（Phase 3 引入） |

---

## 13. 子方案文档规划

各领域详细技术方案按以下模板产出，均放在 `docs/技术方案/` 目录下：

| 序号 | 子方案文件名 | 对应领域 | 状态 |
|-----|------------|---------|------|
| 1 | `2026-04-28_模型管理-领域对象定义.md` | model | 已完成（属性定义） |
| 2 | `2026-04-28_模型管理-技术方案.md` | model | 待产出 |
| 3 | `YYYY-MM-DD_Agent管理-技术方案.md` | agent | 待产出 |
| 4 | `YYYY-MM-DD_用户管理-技术方案.md` | user | 待产出 |
| 5 | `YYYY-MM-DD_RBAC权限管理-技术方案.md` | rbac | 待产出 |
| 6 | `YYYY-MM-DD_认证与登录-技术方案.md` | user/auth | 待产出 |
| 7 | `YYYY-MM-DD_用户端对话与会话管理-技术方案.md` | user/chat | 待产出 |
| 8 | `YYYY-MM-DD_Skill商店-技术方案.md` | skill | 待产出 |
| 9 | `YYYY-MM-DD_MCP管理-技术方案.md` | mcp | 待产出 |
| 10 | `YYYY-MM-DD_工作流管理-技术方案.md` | workflow | 待产出 |
| 11 | `YYYY-MM-DD_首页仪表盘-技术方案.md` | home | 待产出 |
| 12 | `YYYY-MM-DD_系统配置-技术方案.md` | system_config | 待产出 |
| 13 | `YYYY-MM-DD_审计日志-技术方案.md` | audit | 待产出 |

---

## 14. 其他

### 14.1 加密策略

- **API Key**：使用 AES-256 对称加密存储，密钥通过环境变量注入
- **密码**：BCrypt 哈希，不存储明文
- **敏感日志**：审计日志中的敏感字段（密码、Token）需脱敏

### 14.2 日志策略

- **应用日志**：SLF4J + Logback，按级别输出到文件
- **审计日志**：业务操作审计记录到 `audit_log` 表
- **访问日志**：通过 Filter 记录每个 HTTP 请求的访问日志

### 14.3 性能基线

| 指标 | 目标值 |
|-----|--------|
| 接口响应时间（P99） | < 2 秒 |
| 数据库查询响应时间 | < 100 毫秒 |
| 并发用户数 | >= 1000 |
| 系统可用性 | >= 99.9% |

### 14.4 后续待决策项

| 决策项 | 状态 | 说明 |
|-------|------|------|
| groupId / 包名前缀 | 待定 | 需用户确认 |
| 工作流引擎选型 | 待定 | LiteFlow vs Temporal，Phase 3 决策 |
| RocketMQ 引入时机 | Phase 3 | 用于领域事件异步处理 |
| MinIO / S3 存储 | Phase 3 | 文件/附件/模型文件存储 |
| Spring Cloud Gateway | Phase 4 | 微服务拆分时引入 |
| Redis 引入时机 | Phase 1 | RBAC 权限缓存 + 限流 |
| 用户端后端 | 已确认 | 登录/找回密码/个人中心/Agent 对话会话/消息流式输出/附件上传纳入范围 |
