# CLAUDE.md — GAgentManager

## 项目概览

GAgentManager 是一个企业级 Agent（智能体）管理平台，采用前后端分离架构。

- **后端**：Spring Boot 3.4 + Java 21，DDD 六层架构，MySQL 8.0
- **前端管理端**：React 18 + TypeScript + Ant Design 5 + Pro Components，Vite 构建，端口 3000
- **前端用户端**：React 18 + TypeScript + Ant Design 6 + Ant Design X，Vite 构建，端口 3002
- **后端服务**：端口 8080

---

## 后端开发规范

### 六层分层架构

```
adapter → application → domain → client
                              ↑
infra ────────────────────────┘
facade ───→ client
start → adapter（入口）
```

| 层 | 包路径 | 职责 | 依赖 |
|---|--------|------|------|
| adapter | `com.gagentmanager.adapter.*` | REST Controllers、安全配置、全局异常处理 | application, client |
| application | `com.gagentmanager.application.*` | Application Service、用例编排、事务边界 | domain, client |
| domain | `com.gagentmanager.domain.*` | 聚合根、领域服务、仓储接口、领域枚举 | client |
| infra | `com.gagentmanager.infra.*` | 仓储实现、MyBatis Mapper、DO 实体 | domain, client |
| facade | `com.gagentmanager.facade.*` | 通用接口定义与 DTO（可移植） | client |
| client | `com.gagentmanager.client.*` | DTO/VO/Param 定义 | 无 |
| start | `com.gagentmanager.start` | Spring Boot 入口、配置文件 | adapter |

**分层约束**：每层只能依赖规定的下游层，禁止跨层依赖或反向依赖。

### Controller 编写规范

- 继承 `BaseController`，使用 `success()` / `success(data)` 返回统一响应
- Query 类 Controller 使用 `@GetMapping`，Command 类使用 `@PostMapping`
- URL 按功能模块划分为 `/api/{module}/query/*` 和 `/api/{module}/command/*`
- 写操作从 `HttpServletRequest.getAttribute("userId")` 获取操作人 ID
- 参数校验使用 `@Valid` + `@RequestBody`，简单参数用 `@RequestParam`

```java
@RestController
@RequestMapping("/api/model/query")
public class ModelQueryController extends BaseController {
    private final ModelQueryService modelQueryService;

    public ModelQueryController(ModelQueryService modelQueryService) {
        this.modelQueryService = modelQueryService;
    }

    @GetMapping("/list")
    public Result<PageResult<ModelVO>> list(PageParam pageParam, String keyword, String provider) {
        IPage<ModelVO> page = modelQueryService.listModels(pageParam, keyword, provider);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }
}
```

### Service 编写规范

- 使用 `@Service` 注解，构造器注入依赖
- CommandService 处理写操作（创建/更新/删除/状态变更）
- QueryService 处理读操作（列表/详情）
- 业务异常使用 `throw new BusinessException(ErrorCode.XXX)`
- 使用 `BeanUtils.copyProperties` 进行对象转换

```java
@Service
public class ModelCommandService {
    private final ModelRepository modelRepository;

    public ModelCommandService(ModelRepository modelRepository) {
        this.modelRepository = modelRepository;
    }

    public ModelVO createModel(CreateModelParam param, Long operatorId) {
        Model existing = modelRepository.findByCode(param.getModelCode());
        if (existing != null) {
            throw new BusinessException(ErrorCode.MODEL_CODE_ALREADY_EXISTS);
        }
        Model model = new Model();
        BeanUtils.copyProperties(param, model);
        model.save(operatorId);
        modelRepository.save(model, operatorId);
        return toVO(model);
    }

    private ModelVO toVO(Model m) {
        ModelVO vo = new ModelVO();
        BeanUtils.copyProperties(m, vo);
        return vo;
    }
}
```

### Domain 领域模型规范

- 聚合根继承 `DomainEntity`（包含 id, num, createNo, updateNo, createTime, updateTime, deleted）
- `ensureNum()` 在 save 时自动生成 num（UUID 前 18 位）
- 领域动作定义在聚合根上：save、delete、enable、disable
- 仓储接口定义在 domain 层，实现在 infra 层

```java
public class Model extends DomainEntity {
    private String modelCode;
    private String status; // ENABLED/DISABLED/ERROR

    public void enable(Long operatorId) {
        this.status = "ENABLED";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void delete(Long operatorId) {
        this.setDeleted(true);
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }
}
```

### Infra 仓储实现规范

- Entity 继承 `DomainEntity`，使用 `@TableName` 映射表名，`@TableId(type = IdType.AUTO)` 主键自增
- Mapper 继承 `BaseMapper<Entity>`
- RepositoryImpl 实现 domain 层定义的仓储接口
- 使用 `LambdaQueryWrapper` 构建查询条件
- 使用 `BeanUtils.copyProperties` 在 Entity 和 Domain 之间转换

```java
@Repository
public class ModelRepositoryImpl implements ModelRepository {
    private final ModelMapper modelMapper;

    @Override
    public Model findByNum(String num) {
        LambdaQueryWrapper<ModelEntity> qw = new LambdaQueryWrapper<ModelEntity>()
                .eq(ModelEntity::getNum, num)
                .eq(ModelEntity::getDeleted, false);
        ModelEntity e = modelMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }
}
```

### 异常处理

`GlobalExceptionHandler` 统一捕获并转换异常：

| 异常类型 | 处理方式 |
|---------|---------|
| `BusinessException` | `Result.fail(errorCode)` |
| `MethodArgumentNotValidException` | `Result.fail(400, 错误信息)` |
| `AccessDeniedException` | `Result.fail(403)` |
| `Exception` | `Result.fail(500)` |

### 错误码规范

定义在 `facade/common/ErrorCode.java`，按模块分段：

| 段 | 范围 | 模块 |
|---|------|------|
| 通用 | 200-500 | SUCCESS, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, INTERNAL_ERROR |
| 认证 | 1001-1099 | 用户名密码、Token、会话、设备 |
| Agent | 1101-1199 | Agent CRUD、版本、资源绑定 |
| Model | 1201-1299 | 模型编码、名称、连通性 |
| Skill | 1301-1399 | Skill 编码、安装、评价 |
| MCP | 1401-1499 | MCP 编码、名称、连通性 |
| Workflow | 1501-1599 | 工作流编码、名称 |
| Audit | 1601-1699 | 审计日志 |
| RBAC | 1701-1799 | 角色、权限 |
| Home | 1801-1899 | 通知、搜索 |
| System Config | 1901-1999 | 配置项 |

### MyBatis Plus 配置

```yaml
mybatis-plus:
  global-config:
    db-config:
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0
  configuration:
    map-underscore-to-camel-case: true
```

- `deleteById` 触发软删除（自动设置 deleted=1）
- `updateById` 跳过 deleted 字段
- 查询自动过滤 deleted=true 的数据

### 统一响应格式

```java
@Data
public class Result<T> {
    private int code;       // 200=成功, 400=参数错误, 500=系统错误
    private String message;
    private T data;
}
```

前端响应码：`0` 或 `200` 表示成功，其他表示失败。

---

## 前端开发规范

### 目录结构

```
frontend/admin/src/
├── api/              # API 请求封装（每个模块一个文件）
├── pages/            # 页面组件（每个功能一个目录）
│   ├── UserManagement/
│   │   ├── index.tsx         # 列表页（ProTable）
│   │   └── detail.tsx        # 详情页（新增/编辑/详情三合一）
│   └── ...
├── types/            # TypeScript 类型定义（每个模块一个文件）
├── layouts/          # 布局组件（MainLayout.tsx）
├── routes/           # 路由守卫（ProtectedRoute.tsx）
├── store/            # Zustand 状态管理（auth.ts）
├── utils/            # 工具函数
├── components/       # 通用组件
├── App.tsx           # 路由配置
└── main.tsx          # 应用入口
```

### API 调用规范

- HTTP 请求统一封装在 `src/api/request.ts`
- baseURL 为 `/api`，Vite 代理到后端 8080 端口
- 每个业务模块一个 API 文件
- API 路径去掉 `/api` 前缀，如 `/model/query/list`

```typescript
import { get, post } from './request'

export function getModels(params?: Record<string, unknown>) {
  return get<PageResult<ModelItem>>('/model/query/list', { params })
}

export function createModel(data: ModelFormValues) {
  return post<ModelItem>('/model/command/create', data)
}
```

### 列表页编写规范（ProTable）

- `rowKey` 使用业务编号字段（如 `num`）
- 搜索使用 `valueEnum` 配置下拉筛选
- 文本字段使用 `ellipsis: true` 防止换行
- 操作列固定右侧 `fixed: 'right'`
- 使用 `useSearchParams` 同步筛选条件到 URL
- 使用 `actionRef` 获取表格实例，操作后 `reload()`

### 详情页编写规范

详情页遵循 **UserManagement/detail.tsx** 模式：

- 使用 `PageContainer` 包裹
- 三种状态：新增（`num === 'new'`）、编辑（`editing === true`）、详情（默认）
- 详情展示使用 `Descriptions` 组件，`column={2}`
- 编辑使用 Ant Design `Form` 组件，`labelCol: { span: 4 }, wrapperCol: { span: 12 }`
- 从列表进入时通过 `location.state` 传递列表查询参数
- 顶部操作按钮根据状态动态显示
- 状态映射使用 `Record<string, { text: string; color: string }>` 格式

### VO → 前端对象转换模式

```typescript
const STATUS_MAP: Record<string, { text: string; color: string }> = {
  ENABLED: { text: '已启用', color: 'green' },
  DISABLED: { text: '已禁用', color: 'default' },
}

function toModelItem(vo: Record<string, unknown>): ModelItem {
  const rawStatus = String(vo.status || 'ENABLED')
  const statusInfo = STATUS_MAP[rawStatus] || STATUS_MAP.ENABLED
  return {
    modelId: String(vo.id || ''),
    num: String(vo.num || ''),
    modelName: String(vo.modelName || ''),
    status: statusInfo.text as '已启用' | '已禁用' | '异常',
    _rawStatus: rawStatus,  // 保留原始值用于判断逻辑
    createTime: vo.createTime ? new Date(vo.createTime as number).toLocaleString('zh-CN') : '',
  }
}
```

### 状态管理

- 使用 Zustand（`src/store/auth.ts`）
- Token 存储在 localStorage
- 认证失效时 request interceptor 自动清除登录态并跳转登录页

### 前端路由配置

路由统一在 `App.tsx` 中管理，使用 `ProtectedRoute` 守卫：

```typescript
<Route path="models" element={<ModelManagement />} />
<Route path="models/:num" element={<ModelDetail />} />
```

---

## 后端模块包一览

| 模块 | adapter 包 | URL 前缀 |
|------|-----------|---------|
| auth | `adapter.auth` | `/api/auth` |
| user | `adapter.user` | `/api/user/query/*`, `/api/user/command/*` |
| agent | `adapter.agent` | `/api/agent/query/*`, `/api/agent/command/*` |
| chat | `adapter.chat` | `/api/chat/query/*`, `/api/chat/command/*` |
| file | `adapter.file` | `/api/file` |
| prompt | `adapter.prompt` | `/api/prompt` |
| model | `adapter.model` | `/api/model/query/*`, `/api/model/command/*` |
| skill | `adapter.skill` | `/api/skill/query/*`, `/api/skill/command/*` |
| mcp | `adapter.mcp` | `/api/mcp/query/*`, `/api/mcp/command/*` |
| workflow | `adapter.workflow` | `/api/workflow/query/*`, `/api/workflow/command/*` |
| rbac | `adapter.rbac` | `/api/rbac/query/*`, `/api/rbac/command/*` |
| audit | `adapter.audit` | `/api/audit/query/*` |
| system_config | `adapter.system_config` | `/api/system-config/query/*`, `/api/system-config/command/*` |
| home | `adapter.home` | `/api/home` |

---

## 重要约定

### 状态映射

- **后端**使用英文枚举值：`ENABLED`, `DISABLED`, `ERROR`, `DRAFT`, `RESIGNED`
- **前端展示**使用中文：`已启用`, `已禁用`, `异常`, `草稿`, `离职`
- 转换在 `toXxxItem()` 函数中完成，保留 `_rawStatus` 字段存储原始值用于逻辑判断

### API Key 加密

- 使用 `AesEncryptor.encrypt()` 加密后存储，密钥读取环境变量 `AES_ENCRYPT_KEY`
- 前端不接触加密逻辑，后端自动处理

### 编号生成

- 所有实体的 `num` 字段由 `DomainEntity.ensureNum()` 自动生成（UUID 前 18 位）
- 新增时无需前端传递

### 删除策略

- 统一使用逻辑删除（`deleted` 字段）
- 不同模块有不同前置校验：
  - 用户：仅 `DRAFT` 状态可删除
  - 模型：仅 `DISABLED` 状态可删除
  - Agent/Skill/MCP：无资源绑定时可删除

### ProTable valueEnum

筛选列必须配置 `valueEnum` 才能正常下拉选择，值使用前端中文展示值。

---

## 构建与运行

```bash
# 后端
cd backend && mvn spring-boot:run -pl start

# 前端管理端
cd frontend/admin && npm run dev    # 端口 3000

# 前端用户端
cd frontend/user && npm run dev     # 端口 3002
```

---

## PRD 编写/修改规则

**编写或修改 PRD 文档时，必须使用 `design-prd` 技能，禁止手动编写或修改 PRD 文件。**

当用户要求写 PRD 文档时，严格按照以下顺序执行，不可跳过或合并步骤：

1. **brainstorm** — 先用 brainstorm 技能探索需求、收集想法、明确业务目标
2. **design-prd** — 再用 design-prd 技能将结果结构化为正式 PRD 文档
3. **writing-plans** — 最后用 writing-plans 技能拆解实施计划

## 技术方案编写/修改规则

**编写或修改技术方案文档时，必须使用 `design-technical-solution` 技能，禁止手动编写或修改技术方案文件。**

## 后端 README 同步

每次修改后端代码后，必须同步检查并更新 `backend/README.md`，确保文档与实际代码（模块结构、技术栈、功能模块、配置等）保持一致。
