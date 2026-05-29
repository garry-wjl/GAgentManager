# GAgentManager Backend — 开发指南

## 项目概览

企业级 Agent（智能体）管理平台后端服务。

| 属性 | 值 |
|------|-----|
| **框架** | Spring Boot 3.4.1 + Java 21 |
| **架构** | DDD 六层分层架构 |
| **ORM** | MyBatis Plus 3.5.9 + MySQL 8.0 |
| **认证** | JWT 双 Token（Access 2h + Refresh 7d） |
| **API 文档** | Knife4j (Swagger) 4.5.0 |
| **构建** | Maven 多模块 |
| **端口** | 8080 |

---

## 模块结构

```
backend/
├── adapter/       # 适配层 — REST Controller、安全配置、全局异常处理
├── application/   # 应用层 — CommandService / QueryService、事务、AOP 审计
├── domain/        # 领域层 — 聚合根、仓储接口、领域服务、网关接口
├── infra/         # 基础设施层 — 仓储实现、MyBatis Mapper/Entity、第三方 SDK
├── facade/        # 门面层 — 可移植的通用接口（Result、ErrorCode、DomainEntity、事件）
├── client/        # 客户端层 — DTO/VO/Param，跨层传输对象
├── start/         # 启动入口 + application.yml 配置
└── sql/           # 数据库初始化脚本
```

### 依赖关系

```
start → adapter → application → domain → client
                                        ↑
infra ───────────────────────────────────┘
facade ───→ client（facade 只依赖 client）
```

| 层级 | 包路径 | 依赖 | 职责 |
|------|--------|------|------|
| **adapter** | `com.gagentmanager.adapter.*` | application, client | REST Controller、Security、全局异常处理 |
| **application** | `com.gagentmanager.application.*` | infra, client | 用例编排、事务、AOP 审计 |
| **domain** | `com.gagentmanager.domain.*` | client | 聚合根、仓储接口、领域逻辑 |
| **infra** | `com.gagentmanager.infra.*` | domain, client | RepositoryImpl、Mapper、Entity、SDK |
| **facade** | `com.gagentmanager.facade.*` | client | 通用接口（Result、ErrorCode、DomainEntity、事件） |
| **client** | `com.gagentmanager.client.*` | facade | DTO/VO/Param，无业务逻辑 |
| **start** | `com.gagentmanager` | adapter | Spring Boot 入口、application.yml |

**分层约束**：每层只能依赖规定的下游层，禁止跨层依赖或反向依赖。

---

## 各模块 pom.xml 约定

每个子模块的 pom.xml 遵循以下结构：

- 继承父 pom（`gagent-manager`），version 使用 `${project.version}`（`1.0.0-SNAPSHOT`）
- 只依赖 **直接依赖** 的下游模块，不传递依赖超出分层范围
- `facade` 依赖：`spring-boot-starter-web`、`lombok`
- `client` 依赖：`facade`、`lombok`、`jakarta.validation-api`
- `domain` 依赖：`client`、`lombok`、`mybatis-plus-core`（仅 `IPage`）
- `infra` 依赖：`domain`、`mybatis-plus-spring-boot3-starter`、`mybatis-plus-jsqlparser`、`mysql-connector-j`
- `application` 依赖：`infra`、`spring-boot-starter`、`spring-boot-starter-aop`、`spring-web`
- `adapter` 依赖：`application`、`spring-boot-starter-web`、`spring-boot-starter-security`、`spring-boot-starter-validation`
- `start` 依赖：`adapter`、`spring-boot-starter-web`、`spring-boot-starter-test`（test scope）
- 构建使用 `maven-compiler-plugin` 3.13+，配置 `parameters: true`（保留参数名）

---

## 通用组件（facade 层）

### DomainEntity 基类

所有聚合根继承 `com.gagentmanager.facade.common.DomainEntity`：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 数据库自增主键 |
| num | String | 业务编号（UUID 前 18 位，`ensureNum()` 自动生成） |
| createNo | String | 创建人编号 |
| updateNo | String | 更新人编号 |
| createTime | Date | 创建时间 |
| updateTime | Date | 更新时间 |
| deleted | Boolean | 逻辑删除标志 |

```java
public class Model extends DomainEntity {
    public void save(Long operatorId) {
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new Date());
        }
        this.setUpdateTime(new Date());
    }

    public void delete(Long operatorId) {
        this.setDeleted(true);
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }
}
```

### Result 统一响应

```java
public class Result<T> {
    private int code;       // 200=成功
    private String message;
    private T data;
}
```

- Controller 继承 `BaseController`，使用 `success()` / `success(data)` 返回
- 前端响应码：`0` 或 `200` 表示成功，其他表示失败

### ErrorCode 错误码

定义在 `facade/common/ErrorCode.java`，使用 `record` 类型：

```java
public record ErrorCode(int code, String message) {
    public static final ErrorCode MODEL_CODE_ALREADY_EXISTS = new ErrorCode(1201, "模型编码已存在");
    // ...
    public BusinessException toException() { return new BusinessException(this); }
}
```

| 段 | 范围 | 说明 |
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

添加新错误码时选择对应模块的分段范围，超出范围时扩展该模块的段尾。

### BusinessException

```java
throw new BusinessException(ErrorCode.MODEL_NOT_FOUND);
throw new BusinessException(ErrorCode.MODEL_NOT_FOUND, "optional detail message");
```

### PageResult

```java
PageResult.of(List<T> records, long total, int pageNo, int pageSize);
PageResult.empty(int pageNo, int pageSize);
```

### 领域事件（Domain Events）

- 事件类定义在 `facade` 层，按模块分包（如 `facade.model.ModelCreatedEvent`）
- 每个模块一个事件常量接口（如 `facade.model.ModelEventConstants`）
- 发布统一通过 `DomainEventPublisher.publish(Object event)`（封装 Spring `ApplicationEventPublisher`）
- 事件 DTO 结构：`DomainEventDTO` 包含 eventType、resourceType、resourceId、resourceNum、operatorId、operatorName、payload

---

## Adapter 层规范

### Controller 通用规范

- 继承 `com.gagentmanager.adapter.common.BaseController`
- 构造器注入依赖
- **QueryController** — `@RestController` + `@RequestMapping("/api/{module}/query")`，方法使用 `@GetMapping`
- **CommandController** — `@RestController` + `@RequestMapping("/api/{module}/command")`，方法使用 `@PostMapping`
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
        IPage<ModelVO> page = modelQueryService.listModels(pageParam, keyword, provider, null, null);
        return success(PageResult.of(page.getRecords(), page.getTotal(),
                (int) page.getCurrent(), (int) page.getSize()));
    }
}
```

```java
@RestController
@RequestMapping("/api/model/command")
public class ModelCommandController extends BaseController {
    private final ModelCommandService modelCommandService;

    public ModelCommandController(ModelCommandService modelCommandService) {
        this.modelCommandService = modelCommandService;
    }

    @PostMapping("/create")
    public Result<ModelVO> create(@Valid @RequestBody CreateModelParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        return success(modelCommandService.createModel(param, operatorId));
    }

    @PostMapping("/delete")
    public Result<Void> delete(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        modelCommandService.deleteModel(num, operatorId);
        return success();
    }
}
```

### 安全配置

`SecurityConfig` 配置在 `adapter.config` 包中：

- 禁用 CSRF + 无状态 Session
- 白名单 URL：`/api/auth/login`、`/api/auth/refresh`、`/api/auth/reset-password`、`/api/user/profile/avatar/**`、Swagger 路径
- 其他所有 `/api/**` 请求需认证
- 使用 `TokenValidationFilter` 解析 `Authorization: Bearer <token>`，将 `userId` 存入 request attribute

### 全局异常处理

`GlobalExceptionHandler` 处理：

| 异常 | HTTP Status | 响应 |
|------|-------------|------|
| `BusinessException` | 200 | `Result.fail(errorCode)` |
| `MethodArgumentNotValidException` | 400 | `Result.fail(400, 错误信息)` |
| `BindException` | 400 | `Result.fail(400, "参数绑定失败")` |
| `ConstraintViolationException` | 400 | `Result.fail(400, 错误信息)` |
| `BadCredentialsException` | 200 | `Result.fail(1001)` |
| `AccessDeniedException` | 403 | `Result.fail(403)` |
| `Exception` | 500 | `Result.fail(500)` |

### 模块 URL 路由

| 模块 | Query URL | Command URL | adapter 包 |
|------|-----------|-------------|-----------|
| auth | — | `/api/auth` | `adapter.auth` |
| user | `/api/user/query/*` | `/api/user/command/*` | `adapter.user` |
| agent | `/api/agent/query/*` | `/api/agent/command/*` | `adapter.agent` |
| chat | `/api/chat/query/*` | `/api/chat/command/*` | `adapter.chat` |
| file | — | `/api/file` | `adapter.file` |
| prompt | — | `/api/prompt` | `adapter.prompt` |
| model | `/api/model/query/*` | `/api/model/command/*` | `adapter.model` |
| skill | `/api/skill/query/*` | `/api/skill/command/*` | `adapter.skill` |
| mcp | `/api/mcp/query/*` | `/api/mcp/command/*` | `adapter.mcp` |
| workflow | `/api/workflow/query/*` | `/api/workflow/command/*` | `adapter.workflow` |
| rbac | `/api/rbac/query/*` | `/api/rbac/command/*` | `adapter.rbac` |
| audit | `/api/audit/query/*` | — | `adapter.audit` |
| system_config | `/api/system-config/query/*` | `/api/system-config/command/*` | `adapter.system_config` |
| home | `/api/home` | — | `adapter.home` |

---

## Application 层规范

### Service 通用规范

- 使用 `@Service` 注解，构造器注入依赖
- **CommandService** — 写操作（创建/更新/删除/状态变更/连通性测试）
- **QueryService** — 读操作（列表/详情，返回 DTO）
- 使用 `BeanUtils.copyProperties` 进行对象转换（注意：源对象字段名和类型需与目标一致）
- 分页查询：`new Page<>(pageParam.getPageNo(), pageParam.getPageSize())` → `modelPage.convert(this::toVO)`
- 业务异常使用 `throw new BusinessException(ErrorCode.XXX)`

```java
@Service
public class ModelCommandService {
    private final ModelRepository modelRepository;
    private final ModelGateway modelGateway;

    public ModelCommandService(ModelRepository modelRepository, ModelGateway modelGateway) {
        this.modelRepository = modelRepository;
        this.modelGateway = modelGateway;
    }

    public ModelVO createModel(CreateModelParam param, Long operatorId) {
        Model existing = modelRepository.findByCode(param.getModelCode());
        if (existing != null) {
            throw new BusinessException(ErrorCode.MODEL_CODE_ALREADY_EXISTS);
        }
        Model model = new Model();
        BeanUtils.copyProperties(param, model);
        // 敏感数据加密
        model.setApiKey(AesEncryptor.encrypt(param.getApiKey()));
        model.save(operatorId);          // 领域方法：初始化审计字段
        modelRepository.save(model, operatorId); // 持久化
        return toVO(model);
    }

    public void deleteModel(String num, Long operatorId) {
        Model model = modelRepository.findByNum(num);
        if (model == null) {
            throw new BusinessException(ErrorCode.MODEL_NOT_FOUND);
        }
        model.delete(operatorId);        // 领域方法：置 deleted=true
        modelRepository.delete(num, operatorId);
    }

    public IPage<ModelVO> listModels(PageParam pageParam, String keyword, String provider) {
        Page<Model> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<Model> modelPage = modelRepository.list(page, keyword, provider, null, null);
        return modelPage.convert(this::toVO);
    }

    private ModelVO toVO(Model m) {
        ModelVO vo = new ModelVO();
        BeanUtils.copyProperties(m, vo);
        return vo;
    }
}
```

### 审计切面（AuditAspect）

- 定义在 `application.common` 包
- 自动拦截所有 Controller 的 `@PostMapping` 方法
- 通过方法名前缀推断操作类型（create → CREATE, update → UPDATE, delete → DELETE 等）
- 通过类名推断资源类型（Agent → AGENT, Model → MODEL 等）
- 在 finally 块中持久化审计日志，异常不影响主流程

---

## Domain 层规范

### 聚合根

- 继承 `DomainEntity`
- 领域方法定义在聚合根上：`save(operatorId)`、`delete(operatorId)`、`enable(operatorId)`、`disable(operatorId)` 等
- `save()` 方法内调用 `ensureNum()` 自动生成 num
- 状态变更方法同时更新 `updateNo` 和 `updateTime`
- 前置校验（如只有 DRAFT 可删除）在聚合根方法内执行

```java
public class Model extends DomainEntity {
    private String status;  // ENABLED / DISABLED / ERROR

    public void save(Long operatorId) {
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new Date());
            if (this.status == null) this.status = "ENABLED";
        }
        this.setUpdateTime(new Date());
    }

    public void enable(Long operatorId) {
        this.status = "ENABLED";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }
}
```

### 仓储接口（Repository Interface）

- 定义在 domain 层，实现在 infra 层
- 方法命名：`findById`、`findByNum`、`findByCode`、`list`、`save`、`delete`
- `save` 方法负责 insert/update 判断（根据 id 是否为 null）
- 分页返回 `IPage<Model>`（MyBatis Plus 类型）

### 网关接口（Gateway Interface）

- 用于定义外部依赖的调用抽象（如 `ModelGateway` 测试 LLM 连接）
- 实现在 infra 层

### 领域层依赖

- domain 只依赖 client 和 `mybatis-plus-core`（仅使用 `IPage` 类型）
- **不依赖** `mybatis-plus-spring-boot-starter`、`spring-boot-starter-web` 等

---

## Infra 层规范

### Entity（数据库实体）

- 继承 `DomainEntity`，使用 `@EqualsAndHashCode(callSuper = true)`
- 使用 `@TableName("table_name")` 映射表名
- id 字段使用 `@TableId(type = IdType.AUTO)` 主键自增
- 数据库字段使用下划线命名，MyBatis Plus 自动转驼峰

```java
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("model")
public class ModelEntity extends DomainEntity {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String modelCode;
    private String modelName;
    private String status;
    // ... 其他字段
}
```

### Mapper

- 继承 `BaseMapper<Entity>`，使用 `@Mapper` 注解
- 无需额外方法声明，BaseMapper 提供基础 CRUD

```java
@Mapper
public interface ModelMapper extends BaseMapper<ModelEntity> {
}
```

### RepositoryImpl

- 实现 domain 层定义的 Repository 接口
- 使用 `@Repository` 注解
- 使用 `LambdaQueryWrapper` 构建查询条件
- 使用 `BeanUtils.copyProperties` 在 Entity 和 Domain 之间转换
- `save` 方法：若 domain 对象 id 为 null 则 `insert`，否则 `updateById`（insert 后回写 id）
- `delete` 方法调用 `modelMapper.deleteById` 触发 MyBatis Plus 逻辑删除

```java
@Repository
public class ModelRepositoryImpl implements ModelRepository {
    private final ModelMapper modelMapper;

    public ModelRepositoryImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public Model findByNum(String num) {
        LambdaQueryWrapper<ModelEntity> qw = new LambdaQueryWrapper<ModelEntity>()
                .eq(ModelEntity::getNum, num)
                .eq(ModelEntity::getDeleted, false);
        ModelEntity e = modelMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public void save(Model model, Long operatorId) {
        model.save(operatorId);
        ModelEntity e = toEntity(model);
        if (model.getId() == null) {
            modelMapper.insert(e);
            model.setId(e.getId());
        } else {
            modelMapper.updateById(e);
        }
    }

    private Model toDomain(ModelEntity e) {
        Model d = new Model();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private ModelEntity toEntity(Model d) {
        ModelEntity e = new ModelEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }
}
```

---

## Client 层规范

- 只包含 DTO/VO/Param 类，无业务逻辑
- 每个模块一个包（如 `client.model`、`client.user`）
- 使用 `jakarta.validation` 注解做参数校验
- VO 通过 `BeanUtils.copyProperties` 从 Domain 对象转换
- Param 由 Controller 接收，传递给 application 层

```java
@Data
public class CreateModelParam {
    @NotBlank(message = "模型编码不能为空")
    private String modelCode;

    @NotBlank(message = "模型名称不能为空")
    private String modelName;

    private String provider;
    private String apiKey;  // 前端传入原始值，后端自动加密
    // ...
}
```

---

## MyBatis Plus 配置

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
- 查询自动过滤 deleted=true 的数据
- `updateById` 跳过 deleted 字段（不更新该字段）

### MybatisPlusConfig

配置在 `infra.common` 包：

- 启用 `PaginationInnerInterceptor(DbType.MYSQL)` 分页插件
- 实现 `MetaObjectHandler`，自动填充 `createTime`、`updateTime`、`deleted`
- 启用 `@EnableTransactionManagement`

---

## 重要约定

### 编号生成

- 所有实体的 `num` 字段由 `DomainEntity.ensureNum()` 自动生成（UUID 前 18 位）
- 新增时前端不传递 num，由后端 `save()` 方法内生成

### 状态值

| 实体 | 状态枚举值 |
|------|-----------|
| User | `DRAFT`、`ENABLED`、`DISABLED`、`RESIGNED` |
| Model | `ENABLED`、`DISABLED`、`ERROR` |
| Agent | `DRAFT`、`PUBLISHED`、`ONLINE`、`OFFLINE`、`DISABLED` |
| MCP | `ENABLED`、`DISABLED`、`ERROR` |
| Workflow | `DRAFT`、`PUBLISHED`、`DISABLED` |
| Model 连通性 | `UNTESTED`、`CONNECTED`、`ERROR` |
| Skill | `NOT_INSTALLED`、`INSTALLED`、`DISABLED` |

### 删除策略

- 统一逻辑删除（`deleted` 字段）
- **User**：仅 `DRAFT` 状态可删除，否则抛出 `USER_DELETE_NOT_DRAFT`
- **Model**：仅 `DISABLED` 状态可删除
- **Agent/Skill/MCP/Workflow**：无资源绑定时可删除，有绑定抛出 `XXX_HAS_BINDINGS`

### API Key 加密

- 使用 `AesEncryptor.encrypt()` 加密后存储
- 密钥从环境变量 `AES_ENCRYPT_KEY` 读取，兜底默认值
- 前端不接触加密逻辑，后端在 application 层自动处理

### JWT 认证

- Access Token：2 小时有效期，携带 userId 和 username
- Refresh Token：7 天有效期，仅携带 userId
- 密钥从 `application.yml` 读取（`jwt.access-token-secret`、`jwt.refresh-token-secret`）
- `TokenValidationFilter` 解析 token 后将 userId 注入 `request.setAttribute("userId", userId)`
- Controller 通过 `(Long) request.getAttribute("userId")` 获取操作人

### BeanUtils.copyProperties 注意事项

- 使用 `org.springframework.beans.BeanUtils`（不是 Apache Commons 的）
- 排除字段：`BeanUtils.copyProperties(source, target, "field1", "field2")`
- 字段名和类型必须完全匹配，否则不会被复制

---

## 新增功能模块的标准步骤

以新增 `notification` 模块为例：

1. **facade 层** — 添加 ErrorCode（1801-1899 段之外扩段）、领域事件类、事件常量接口
2. **client 层** — 在 `client/notification/` 定义 CreateNotificationParam、NotificationVO、PageParam 等
3. **domain 层** — 在 `domain/notification/` 定义 Notification 聚合根、NotificationRepository 接口
4. **infra 层** — 在 `infra/notification/` 定义 NotificationEntity、NotificationMapper、NotificationRepositoryImpl
5. **application 层** — 在 `application/notification/` 定义 NotificationCommandService、NotificationQueryService
6. **adapter 层** — 在 `adapter/notification/` 定义 NotificationCommandController、NotificationQueryController
7. **数据库** — 在 `backend/sql/` 中添加建表脚本
8. **README** — 同步更新 `backend/README.md` 和项目 `README.md`

---

## impl-* 层模块代码生成规范

### impl-client-module

生成 `client/{module}/` 目录，包含：
- 所有 Param 类（`Create{Entity}Param`、`Update{Entity}Param`），带 `jakarta.validation` 校验注解
- 所有 VO 类（`{Entity}VO`、`{Entity}SimpleVO`），字段与 domain 对齐
- 分页参数复用 `client.common.PageParam`
- 文件组织：每个模块一个包，每个类一个 `.java` 文件

### impl-domain-module

生成 `domain/{module}/` 目录，包含：
- 聚合根类继承 `DomainEntity`，实现 `save(operatorId)`、`delete(operatorId)`、状态变更方法
- 仓储接口（Repository Interface），定义 `findById`、`findByNum`、`findByCode`、`list`、`save`、`delete`、`count` 等方法
- 网关接口（Gateway Interface，如需调用外部服务）
- 新状态值遵循 **状态枚举值** 约定

### impl-infra-module

生成 `infra/{module}/` 目录，包含：
- **Entity**：继承 `DomainEntity` + `@EqualsAndHashCode(callSuper = true)` + `@TableName` + `@TableId(type = IdType.AUTO)`
- **Mapper**：继承 `BaseMapper<Entity>` + `@Mapper`
- **RepositoryImpl**：实现 domain 层仓库接口，构造器注入 Mapper，使用 `LambdaQueryWrapper` + `BeanUtils.copyProperties`
- `toDomain` / `toEntity` 私有转换方法
- `save()` 方法的 insert/update 判断模式

### impl-application-module

生成 `application/{module}/` 目录，包含：
- **CommandService**：写操作（创建/更新/删除/状态变更），领域对象操作 → 持久化 → 返回 VO
- **QueryService**：读操作（列表/详情），使用 IPage 分页
- 敏感数据（API Key）在 CommandService 中调用 `AesEncryptor.encrypt()`
- `BeanUtils.copyProperties` 在 Service 层做 DTO ↔ Domain 转换

### impl-adapter-module

生成 `adapter/{module}/` 目录，包含：
- **QueryController**：`@GetMapping` 列表/详情，继承 `BaseController`，返回 `Result<PageResult<VO>>`
- **CommandController**：`@PostMapping` CRUD 操作，从 request 获取 operatorId
- URL 路径：`/api/{module}/query/*` 和 `/api/{module}/command/*`

### impl-facade-module

生成或更新 `facade/` 目录，包含：
- 在 `facade/common/ErrorCode.java` 中添加新模块的错误码
- 领域事件类定义在 `facade/{module}/` 包下
- 事件常量接口（`{Module}EventConstants`）

### impl-third-party-sdk

生成 `infra/{module}/` 目录中的 Gateway 实现（如 `infra/model/repository/ModelGatewayImpl.java`）：
- 实现 domain 层定义的 Gateway 接口
- 封装 HTTP 调用、SDK 调用等第三方集成
- 异常包装为 `BusinessException` 抛出

---

## 构建与运行

```bash
# 全量构建（跳过测试）
cd backend && mvn clean package -DskipTests

# 仅编译指定模块
mvn clean compile -pl adapter,application,domain

# 运行测试
mvn test

# 运行指定模块的测试
mvn test -pl domain

# IDE 启动
mvn spring-boot:run -pl start

# 或直接运行 jar
java -jar start/target/start-1.0.0-SNAPSHOT.jar
```

## API 文档

启动后访问：http://localhost:8080/doc.html

## README 同步

每次修改后端代码后，必须同步检查并更新 `backend/README.md`，确保文档与实际代码（模块结构、技术栈、功能模块、配置等）保持一致。