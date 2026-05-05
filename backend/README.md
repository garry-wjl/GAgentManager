# GAgent Manager Backend

Enterprise Agent Management Platform — 企业级 Agent（智能体）管理平台后端服务。

基于 Spring Boot 3.4 + Java 21 构建，采用六层分层架构（Adapter / Application / Client / Domain / Facade / Infra）+ Start 启动模块。

## 技术栈

| 组件 | 版本 |
|------|------|
| Java | 21 |
| Spring Boot | 3.4.1 |
| MyBatis Plus | 3.5.9 |
| MySQL | 8.0.33 |
| JWT (jjwt) | 0.12.6 |
| Spring AI | 1.0.0 |
| Spring AI Alibaba | 1.0.0.2 |
| Knife4j (Swagger) | 4.5.0 |
| Hutool | 5.8.35 |
| Lombok | 1.18.38 |

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

- **adapter** 仅依赖 application 和 client，通过 Controller 暴露 REST API
- **application** 仅依赖 domain 和 client，编排用例、管理事务
- **domain** 仅依赖 client，包含核心业务逻辑和领域模型
- **infra** 依赖 domain，实现仓储接口（MyBatis Plus Mapper + DO）
- **facade** 仅依赖 client，提供可移植的接口定义
- **client** 无内部依赖，仅包含数据传输对象

## 功能模块

| 模块 | 说明 |
|------|------|
| auth | 用户认证 — JWT 登录、注册、Token 刷新 |
| user | 用户管理 — 用户 CRUD、个人资料、聊天 |
| agent | Agent 管理 — Agent CRUD、命令控制、用户端查询 |
| chat | 聊天 — 用户端对话交互、消息引用、对话分享 |
| file | 文件管理 — 文件上传/下载、附件预览、本地存储 |
| prompt | Prompt 模板 — 推荐 Prompt 查询与管理 |
| device | 设备管理 — 登录设备查看、强制下线 |
| agent | Agent 管理 — Agent CRUD、命令控制 |
| skill | Skill 管理 — Skill 注册、发布、命令控制 |
| model | 模型管理 — AI 模型配置、命令控制 |
| workflow | 工作流管理 — 工作流编排、命令控制 |
| mcp | MCP 协议 — Model Context Protocol 命令 |
| home | 首页 — 数据可视化仪表盘、统计分析接口 |
| audit | 审计日志 — 操作审计查询 |
| rbac | 权限管理 — 角色、权限 CRUD |
| system_config | 系统配置 — 全局配置管理 |

## 快速开始

### 前置条件

- JDK 21+
- Maven 3.8+
- MySQL 8.0+

### 1. 初始化数据库

```bash
mysql -u root -p < backend/sql/init.sql
mysql -u root -p < backend/sql/2026-05-15_agent_management_extension.sql
mysql -u root -p < backend/sql/2026-05-05_user_end_refactor.sql
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

## 认证机制

采用 JWT (JSON Web Token) 双 Token 机制：

| Token 类型 | 有效期 | 用途 |
|------------|--------|------|
| Access Token | 2 小时 | API 请求鉴权 |
| Refresh Token | 7 天 | 刷新 Access Token |

请求时在 Header 中携带：`Authorization: Bearer <access-token>`

## 文件存储配置

支持本地文件存储（开发环境）和 MinIO/OSS 对象存储（生产环境）。在 `application.yml` 中配置：

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
      # ... 更多类型见 application.yml
```
