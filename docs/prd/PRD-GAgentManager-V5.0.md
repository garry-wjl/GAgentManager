# GAgentManager 项目产品需求文档 (PRD)

## 1. 项目概述

### 1.1 项目名称
GAgentManager - 企业级Agent管理平台

### 1.2 项目背景
随着人工智能技术的快速发展，各种智能Agent在企业和个人工作中扮演着越来越重要的角色。然而，目前市场上缺乏一套统一、高效的Agent管理平台来帮助企业统一管理其部署的各种Agent，包括聊天机器人、自动化工作流Agent、数据分析Agent等。因此，GAgentManager应运而生，旨在提供一个全面的企业级Agent管理解决方案。

### 1.3 项目目标
- 提供统一的Agent管理平台，简化企业AI Agent的运维
- 支持多种类型的Agent接入和管理
- 提供灵活的Agent生命周期管理功能
- 提供安全可靠的Agent运行环境
- 支持Agent性能监控和分析
- 集成丰富的Skill生态系统
- 提供可视化的MCP管理能力
- 提供全面的模型管理功能
- 确保Agent只能使用平台内已注册的模型、Skill和MCP服务
- 支持Agent与工作流的集成使用
- 提供全面的用户管理功能

### 1.4 成功定义
- 用户能够在一个平台上管理所有Agent、模型、Skill、MCP和用户
- Agent发布时间缩短60%
- Agent运行效率提升40%
- 用户满意度达到85%以上

## 2. 产品愿景与使命

### 2.1 产品愿景
成为业界领先的企业级Agent管理平台，助力企业高效利用AI技术提升运营效率和竞争力。

### 2.2 产品使命
通过提供易于使用、功能强大的Agent管理工具，让企业能够轻松发布、管理和优化其AI Agent生态。

## 3. 目标用户群体

### 3.1 主要用户群体
- **企业IT管理者：** 负责企业Agent系统的整体发布和管理
  - 年龄：30-45岁
  - 职位：IT总监、技术负责人
  - 需求：统一管理企业AI资源，确保安全合规
  - 痛点：现有Agent分散管理，缺乏统一标准

- **开发团队：** 需要发布和调试Agent的开发人员
  - 年龄：25-35岁
  - 职位：软件工程师、AI工程师
  - 需求：快速发布、调试和监控Agent
  - 痛点：发布流程复杂，调试困难

- **数据科学家：** 需要管理AI模型的研究人员
  - 年龄：28-40岁
  - 职位：数据科学家、机器学习工程师
  - 需求：高效管理模型生命周期，快速部署模型
  - 痛点：模型部署流程繁琐，版本管理困难

- **业务分析师：** 使用Agent进行数据分析和业务洞察的人员
  - 年龄：28-40岁
  - 职位：数据分析师、产品经理
  - 需求：通过Agent获取业务洞察
  - 痛点：缺乏简单易用的AI工具

- **系统管理员：** 负责Agent平台运维和安全管理的人员
  - 年龄：30-42岁
  - 职位：系统管理员、DevOps工程师
  - 需求：确保系统稳定运行和安全性
  - 痛点：监控工具分散，难以统一管理

- **人力资源管理员：** 负责用户账户和权限管理的人员
  - 年龄：28-45岁
  - 职位：HR管理员、系统管理员
  - 需求：高效管理平台用户，分配合适权限
  - 痛点：用户管理流程繁琐，权限分配复杂

### 3.2 用户需求分析
- 易用性：用户希望能够简单快捷地使用平台
- 安全性：保障企业数据和Agent的安全
- 扩展性：支持未来功能的扩展
- 性能：保证系统的高效运行
- 可靠性：提供稳定的系统运行
- 合规性：确保Agent只能使用平台内已注册的资源
- 可管理性：支持全面的用户管理功能

## 4. 产品功能需求

### 4.1 核心功能模块

#### 4.1.1 Agent管理
**功能描述：** 管理企业内部所有的AI Agent，提供完整的Agent生命周期管理和个性化配置能力
**用户故事：** 作为开发人员，我希望能够快速创建、发布和管理AI Agent，并通过灵活的配置实现每个Agent的个性化定制，以便更有效地利用AI技术解决问题。

**具体需求：**

##### 4.1.1.1 基础配置

**Agent操作功能：**

- **Agent新增**：支持多种类型Agent的创建（聊天型、工作流型、分析型等），创建后状态为"未发布"
- **Agent上线**：将已发布的Agent设置为运行状态，开始对外提供服务
- **Agent下线**：将运行中的Agent停止服务，状态变更为"已下线"
- **Agent删除**：安全删除不再需要的Agent，需确认Agent已下线且无依赖关系
- **Agent修改**：编辑Agent的基础配置、Skill配置、MCP配置、工作流配置等，修改后Agent处于草稿状态，需重新发布

**Agent发布功能：**

- Agent修改完毕后，支持发布功能，将当前配置生成为一个新版本
- 每次发布都会自动生成新的版本号（修订号+1）
- 发布前自动校验配置的完整性（模型、Skill、MCP、工作流配置是否完整）
- 发布后可选择是否立即上线运行

**Agent版本控制：**
- 采用语义化版本号（V主版本.次版本.修订号，如V1.0.0）
- 新增时自动生成初始版本V1.0.0（草稿状态）
- 每次发布Agent时，版本号自动递增（修订号+1）
- 重大变更可手动递增主版本或次版本
- 支持版本历史记录查看，记录每个版本的变更内容
- 支持版本回滚：可回滚到任意历史版本
- 支持版本对比：对比两个版本之间的配置差异
- 版本分支管理：支持基于版本创建分支进行灰度测试
- 版本状态：草稿、已发布、运行中、已下线、已回滚、已废弃

- Agent基本信息管理：名称、描述、图标
- Agent参数配置：温度、最大Token数、系统提示词等核心参数

**Agent 列表字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| agentId | String | 是 | Agent唯一标识，系统自动生成 |
| agentName | String | 是 | Agent名称，长度2-50字符，不能包含特殊字符 |
| agentType | Enum | 是 | Agent类型：聊天型、工作流型、分析型、自动化型、混合型 |
| description | Text | 否 | Agent描述信息，最大500字符 |
| icon | File | 否 | Agent图标，支持PNG/JPG/SVG，最大2MB |
| status | Enum | 是 | 运行状态：未发布、已发布、已上线、已下线、异常、发布中 |
| boundModel | String | 是 | 绑定的模型名称（来自模型管理） |
| skillCount | Number | 是 | 已绑定Skill数量 |
| mcpCount | Number | 是 | 已绑定MCP服务数量 |
| workflowCount | Number | 是 | 已集成工作流数量 |
| version | String | 是 | 当前版本号，语义化版本号格式（如V1.0.0） |
| creator | String | 是 | 创建人，关联用户ID |
| createTime | DateTime | 是 | 创建时间，系统自动生成 |
| updater | String | 是 | 更新人，关联用户ID，系统自动记录最后修改人 |
| updateTime | DateTime | 是 | 最后更新时间，系统自动更新 |
| lastPublishTime | DateTime | 否 | 最后发布时间 |

**Agent 创建/编辑表单 - 基础配置字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| agentName | String | 是 | Agent名称，2-50字符，全局唯一 |
| agentType | Enum | 是 | Agent类型：聊天型、工作流型、分析型、自动化型、混合型 |
| description | Text | 否 | 描述信息，最大500字符 |
| icon | File | 否 | 图标上传，支持PNG/JPG/SVG，最大2MB |
| systemPrompt | Text | 否 | 系统提示词，最大5000字符，支持Markdown格式 |
| temperature | Number | 否 | 温度参数，范围0.0-2.0，默认1.0，步长0.1 |
| maxTokens | Number | 否 | 最大Token数，范围1-128000，默认4096 |
| topP | Number | 否 | Top-P参数，范围0.0-1.0，默认1.0 |
| topK | Number | 否 | Top-K参数，范围1-100，默认40 |
| frequencyPenalty | Number | 否 | 频率惩罚，范围-2.0-2.0，默认0 |
| presencePenalty | Number | 否 | 存在惩罚，范围-2.0-2.0，默认0 |
| stopSequences | Array | 否 | 停止词序列，最多10个 |
| responseFormat | Enum | 否 | 响应格式：text、json_object、structured_output |
| timeoutSeconds | Number | 否 | 请求超时时间（秒），范围5-300，默认60 |
| retryCount | Number | 否 | 失败重试次数，范围0-5，默认3 |
| version | String | 是 | 版本号，创建时自动生成1.0.0，编辑时递增 |

**Agent 版本管理字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| versionId | String | 是 | 版本唯一标识，系统自动生成 |
| agentId | String | 是 | 所属Agent ID |
| version | String | 是 | 版本号，语义化版本格式（V主版本.次版本.修订号） |
| versionTag | Enum | 是 | 版本标签：草稿、已发布、已上线、已下线、已回滚、已废弃 |
| changelog | Text | 否 | 版本变更说明，最大1000字符 |
| configSnapshot | JSON | 是 | 版本配置快照（包含基础配置、Skill配置、MCP配置、工作流配置） |
| diffFromPrevious | JSON | 否 | 与上一版本的差异对比JSON |
| creator | String | 是 | 版本创建人 |
| publishTime | DateTime | 否 | 发布时间，仅已发布/已上线状态有值 |
| createTime | DateTime | 是 | 版本创建时间 |
| isCurrentVersion | Boolean | 是 | 是否为当前活跃版本 |
| isStable | Boolean | 是 | 是否为稳定版本 |
| rollbackFromVersion | String | 否 | 如果是回滚版本，记录回滚来源的版本号 |
| rollbackAvailable | Boolean | 是 | 是否可回滚到此版本 |
| rollbackToVersion | String | 否 | 如果已回滚，记录回滚到的目标版本号 |

##### 4.1.1.2 Skill配置
- Skill绑定：Agent只能使用Skill商店中已安装的Skill
- Skill可见性控制：配置哪些Skill对该Agent可见
- Skill关联配置：支持特定Skill与Agent的关联和优先级设置
- Skill权限管理：基于权限的Skill访问控制
- Skill参数配置：为每个绑定的Skill配置独立参数

**Agent Skill 配置字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| bindingId | String | 是 | 绑定关系唯一标识，系统自动生成 |
| agentId | String | 是 | 所属Agent ID |
| skillId | String | 是 | Skill ID（来自Skill商店已安装的Skill） |
| skillName | String | 是 | Skill名称，只读，关联展示 |
| skillVersion | String | 是 | Skill版本，只读 |
| isEnabled | Boolean | 是 | 是否启用此Skill，默认true |
| priority | Number | 否 | 优先级，数值越大优先级越高，范围0-100，默认50 |
| skillParams | JSON | 否 | Skill独立参数配置，键值对格式 |
| autoEnable | Boolean | 否 | 是否自动启用新安装的匹配Skill，默认false |
| bindTime | DateTime | 是 | 绑定时间，系统自动生成 |
| bindUser | String | 是 | 绑定操作人 |
| description | Text | 否 | 绑定说明，最大200字符 |

##### 4.1.1.3 MCP配置
- MCP绑定：Agent只能使用MCP管理中已配置的MCP服务
- MCP可见性控制：配置哪些MCP服务对该Agent可见
- MCP关联配置：支持特定MCP服务与Agent的关联设置
- MCP连接参数：为每个绑定的MCP配置独立连接参数
- MCP状态监控：查看Agent关联MCP服务的运行状态

**Agent MCP 配置字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| bindingId | String | 是 | 绑定关系唯一标识，系统自动生成 |
| agentId | String | 是 | 所属Agent ID |
| mcpId | String | 是 | MCP服务ID（来自MCP管理已配置的服务） |
| mcpName | String | 是 | MCP服务名称，只读，关联展示 |
| mcpVersion | String | 是 | MCP协议版本，只读 |
| isEnabled | Boolean | 是 | 是否启用此MCP，默认true |
| connectionParams | JSON | 否 | 独立连接参数配置（可覆盖全局MCP配置） |
| timeoutSeconds | Number | 否 | 连接超时时间（秒），范围5-300，默认30 |
| retryEnabled | Boolean | 否 | 是否启用自动重试，默认true |
| maxRetries | Number | 否 | 最大重试次数，范围0-10，默认3 |
| healthCheckInterval | Number | 否 | 健康检查间隔（秒），范围10-300，默认60 |
| bindTime | DateTime | 是 | 绑定时间，系统自动生成 |
| bindUser | String | 是 | 绑定操作人 |
| lastStatus | Enum | 是 | 最近状态：正常、异常、超时、未连接 |
| lastCheckTime | DateTime | 否 | 最近一次健康检查时间 |

##### 4.1.1.4 工作流管理
- 工作流创建：支持在Agent下创建新的工作流定义
- 工作流修改：编辑工作流节点、逻辑、参数等配置
- 工作流发布：将工作流发布为Agent可调用的工具
- 工作流下线：将已发布的工作流从Agent工具列表中移除
- 工作流删除：永久删除不再使用的工作流
- 工作流集成：Agent可以选择并集成已发布的工作流作为其工具使用
- 工作流关联配置：支持特定工作流与Agent的关联设置
- 工作流可见性控制：配置哪些工作流对该Agent可用
- 工作流工具化：将工作流作为Agent的可调用工具
- 工作流参数传递：配置Agent与工作流之间的参数传递规则

**Agent 工作流管理字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| workflowId | String | 是 | 工作流唯一标识，系统自动生成 |
| agentId | String | 是 | 所属Agent ID |
| workflowName | String | 是 | 工作流名称，2-100字符 |
| description | Text | 否 | 工作流描述，最大500字符 |
| workflowDef | JSON | 是 | 工作流定义（节点、连线、逻辑），使用DSL格式 |
| triggerType | Enum | 是 | 触发方式：手动触发、事件触发、定时触发 |
| status | Enum | 是 | 状态：草稿、已发布、已下线、已删除 |
| isToolEnabled | Boolean | 是 | 是否作为Agent工具可用，默认false |
| toolName | String | 否 | 作为工具时的调用名称，2-50字符，字母开头 |
| toolDescription | Text | 否 | 工具描述，帮助Agent理解何时调用 |
| inputParams | JSON | 是 | 输入参数定义，JSON Schema格式 |
| outputParams | JSON | 是 | 输出参数定义，JSON Schema格式 |
| paramMapping | JSON | 否 | Agent与工作流参数映射规则 |
| timeoutSeconds | Number | 否 | 执行超时（秒），范围10-3600，默认300 |
| version | String | 是 | 工作流版本号，语义化版本格式 |
| creator | String | 是 | 创建人 |
| createTime | DateTime | 是 | 创建时间 |
| publishTime | DateTime | 否 | 最近发布时间 |
| lastExecTime | DateTime | 否 | 最近执行时间 |
| execCount | Number | 是 | 累计执行次数 |
| successRate | Number | 是 | 执行成功率，百分比 |

##### 4.1.1.5 监控与分析
- Agent状态监控：实时监控Agent运行状态
- Agent性能分析：提供性能指标分析报告
- 模型绑定：Agent只能使用模型管理中已注册的模型

**Agent 详情页字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| agentId | String | 是 | Agent唯一标识 |
| agentName | String | 是 | Agent名称 |
| agentType | Enum | 是 | Agent类型 |
| status | Enum | 是 | 运行状态：未发布、已发布、已上线、已下线、异常、发布中 |
| description | Text | 否 | 描述信息 |
| icon | File | 否 | 图标 |
| version | String | 是 | 当前版本 |
| boundModel | String | 是 | 绑定模型 |
| systemPrompt | Text | 否 | 系统提示词 |
| totalRequests | Number | 是 | 累计请求次数 |
| avgResponseTime | Number | 是 | 平均响应时间（毫秒） |
| errorRate | Number | 是 | 错误率（百分比） |
| uptime | Number | 是 | 运行时长（小时） |
| cpuUsage | Number | 是 | CPU使用率（百分比） |
| memoryUsage | Number | 是 | 内存使用率（百分比） |
| lastRequestTime | DateTime | 否 | 最近一次请求时间 |
| creator | String | 是 | 创建人 |
| createTime | DateTime | 是 | 创建时间 |
| updater | String | 是 | 更新人，系统自动记录最后修改人 |
| updateTime | DateTime | 是 | 更新时间 |

**Agent 性能监控字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| agentId | String | 是 | Agent ID |
| timestamp | DateTime | 是 | 数据采集时间 |
| requestCount | Number | 是 | 请求次数（统计周期内） |
| avgResponseTime | Number | 是 | 平均响应时间（毫秒） |
| p95ResponseTime | Number | 是 | P95响应时间（毫秒） |
| p99ResponseTime | Number | 是 | P99响应时间（毫秒） |
| successRate | Number | 是 | 成功率（百分比） |
| errorCount | Number | 是 | 错误次数 |
| tokenUsage | Number | 是 | Token消耗总量 |
| cost | Number | 是 | 调用成本（元） |
| cpuUsage | Number | 是 | CPU使用率（百分比） |
| memoryUsage | Number | 是 | 内存使用率（百分比） |
| activeConnections | Number | 是 | 活跃连接数 |
| queueLength | Number | 是 | 队列长度 |

**验收标准：**
- 用户能够在5分钟内创建并发布一个新的Agent
- 支持至少10种常见Agent类型的创建
- 版本回滚成功率100%
- Agent只能使用系统内已注册的模型、Skill和MCP服务
- Agent能够成功集成和使用工作流功能
- 每个Agent的基础配置、Skill配置、MCP配置、工作流管理可独立配置
- Agent配置变更生效时间小于10秒

#### 4.1.2 用户管理
**功能描述：** 提供全面的用户管理功能，包括用户信息管理、状态管理、权限控制、操作审计等
**用户故事：** 作为管理员，我希望能够对平台用户进行全生命周期管理（新增、启用、禁用、删除、离职、重置密码等），并能够精确控制每个用户的权限，以确保企业数据安全和操作效率。

**用户操作功能：**

- **用户新增**：创建新用户账号，设置基本信息和初始权限
- **用户启用**：将已禁用的用户账号恢复为可用状态
- **用户禁用**：暂停用户账号，用户无法登录，但数据保留
- **用户删除**：永久删除用户账号及其关联数据，需确认无未完成的业务
- **用户离职**：标记用户离职状态，自动禁用账号并转移其负责的业务到指定接收人
- **重置密码**：为用户重置登录密码，重置后生成临时密码通知用户

**用户列表字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| userId | String | 是 | 用户唯一标识，系统自动生成（UUID） |
| username | String | 是 | 登录用户名，3-30字符，字母数字下划线，全局唯一 |
| realName | String | 是 | 真实姓名，2-50字符 |
| nickname | String | 否 | 昵称，2-20字符 |
| password | String | 是 | 密码（加密存储），仅创建和重置时写入 |
| phone | String | 否 | 手机号，11位数字（中国大陆），格式校验 |
| email | String | 是 | 邮箱地址，标准邮箱格式，全局唯一 |
| source | Enum | 是 | 来源：手动创建、导入、SSO、邀请注册、API创建 |
| status | Enum | 是 | 状态：已启用、已禁用、已离职、已删除 |
| role | Enum | 是 | 角色：超级管理员、管理员、开发者、数据科学家、普通用户、访客 |
| department | String | 否 | 所属部门 |
| avatar | File | 否 | 头像图片，支持PNG/JPG，最大1MB |
| notes | Text | 否 | 备注信息，最大500字符 |
| mfaEnabled | Boolean | 是 | 是否启用双因素认证，默认关闭 |
| lastLoginTime | DateTime | 否 | 最近登录时间 |
| lastLoginIp | String | 否 | 最近登录IP地址 |
| creator | String | 否 | 创建人，系统自动记录 |
| createTime | DateTime | 是 | 创建时间 |
| updater | String | 是 | 更新人，系统自动记录最后修改人 |
| updateTime | DateTime | 是 | 更新时间 |
| expireTime | DateTime | 否 | 账号过期时间，空表示永久有效 |
| loginFailCount | Number | 是 | 连续登录失败次数，达到阈值自动锁定 |

**用户创建/编辑表单字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| username | String | 是 | 登录用户名，3-30字符，字母数字下划线，不可重复 |
| password | String | 是 | 密码，创建时必填，8-32字符，需包含大小写字母、数字、特殊字符 |
| confirmPassword | String | 是 | 确认密码，必须与密码一致 |
| realName | String | 是 | 真实姓名，2-50字符 |
| nickname | String | 否 | 昵称，2-20字符 |
| phone | String | 否 | 手机号，11位数字，格式校验 |
| email | String | 是 | 邮箱地址，标准格式，不可重复 |
| source | Enum | 是 | 来源：手动创建、导入、SSO、邀请注册，创建时默认"手动创建" |
| department | String | 否 | 所属部门，支持从部门列表选择 |
| role | Enum | 是 | 角色：超级管理员、管理员、开发者、数据科学家、普通用户、访客 |
| status | Enum | 是 | 状态：已启用、已禁用，创建时默认已启用 |
| expireTime | DateTime | 否 | 账号过期时间，不填表示永久有效 |
| mfaEnabled | Boolean | 否 | 是否强制启用双因素认证，默认关闭 |
| userGroups | Array | 否 | 所属用户组ID列表 |
| permissions | Array | 否 | 额外权限列表（可覆盖角色默认权限） |
| notes | Text | 否 | 备注信息，最大500字符 |

**用户操作记录字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| operationId | String | 是 | 操作记录唯一标识 |
| userId | String | 是 | 目标用户ID |
| operator | String | 是 | 操作人，关联用户ID |
| operationType | Enum | 是 | 操作类型：新增、启用、禁用、删除、离职、重置密码 |
| operationTime | DateTime | 是 | 操作时间 |
| remark | Text | 否 | 操作备注，最大500字符 |

**重置密码字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| userId | String | 是 | 目标用户ID |
| newPassword | String | 是 | 新密码，8-32字符，符合密码复杂度要求 |
| confirmNewPassword | String | 是 | 确认新密码，必须与新密码一致 |
| operator | String | 是 | 操作人，关联用户ID |
| notifyMethod | Enum | 是 | 通知方式：系统消息、邮件、短信，用于发送临时密码 |
| expireHours | Number | 否 | 临时密码过期时间（小时），默认24，范围1-72 |
| remark | Text | 否 | 重置原因备注 |

**角色与权限配置字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| roleId | String | 是 | 角色唯一标识，系统自动生成 |
| roleName | String | 是 | 角色名称，2-50字符，全局唯一 |
| description | Text | 否 | 角色描述，最大200字符 |
| permissions | Array | 是 | 权限列表，每个权限项为模块+操作（如agent:read, agent:write） |
| isSystem | Boolean | 是 | 是否系统内置角色，内置角色不可删除 |
| userCount | Number | 是 | 关联用户数量 |
| createTime | DateTime | 是 | 创建时间 |
| updater | String | 是 | 更新人，系统自动记录最后修改人 |
| updateTime | DateTime | 是 | 更新时间 |
| creator | String | 是 | 创建人 |

**权限模板字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| templateId | String | 是 | 模板唯一标识，系统自动生成 |
| templateName | String | 是 | 模板名称，2-50字符，全局唯一 |
| description | Text | 否 | 模板描述，最大200字符 |
| permissions | Array | 是 | 权限列表 |
| scope | Enum | 是 | 适用范围：全局、部门级、个人级 |
| isSystem | Boolean | 是 | 是否系统内置 |
| createTime | DateTime | 是 | 创建时间 |
| creator | String | 是 | 创建人 |

**用户组字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| groupId | String | 是 | 用户组唯一标识，系统自动生成 |
| groupName | String | 是 | 用户组名称，2-50字符 |
| description | Text | 否 | 描述信息，最大200字符 |
| parentId | String | 否 | 父用户组ID，支持层级结构 |
| members | Array | 是 | 成员用户ID列表 |
| permissions | Array | 否 | 组级别权限 |
| createTime | DateTime | 是 | 创建时间 |
| creator | String | 是 | 创建人 |

**用户操作日志字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| logId | String | 是 | 日志唯一标识，系统自动生成 |
| userId | String | 是 | 操作用户ID |
| username | String | 是 | 操作用户名 |
| action | String | 是 | 操作类型（创建Agent、删除用户等） |
| module | Enum | 是 | 所属模块：Agent管理、用户管理、Skill商店、MCP管理、模型管理、系统设置 |
| targetId | String | 否 | 操作目标对象ID |
| targetName | String | 否 | 操作目标对象名称 |
| detail | JSON | 否 | 操作详情（变更前后数据） |
| ip | String | 是 | 操作IP地址 |
| userAgent | String | 否 | 浏览器/客户端信息 |
| status | Enum | 是 | 操作结果：成功、失败 |
| errorMessage | Text | 否 | 失败时的错误信息 |
| createTime | DateTime | 是 | 操作时间 |

**具体需求：**
- 多级用户角色：超级管理员、管理员、开发者、数据科学家、普通用户、访客
- 用户信息管理：查看、编辑、删除用户信息，支持姓名、昵称、手机号、邮箱、备注、来源等字段
- 用户状态管理：支持对用户进行启用、禁用、删除、离职操作
- 密码管理：重置密码功能，支持通过系统消息、邮件、短信发送临时密码
- 细粒度权限控制：基于功能模块的权限控制
- 单点登录（SSO）：支持企业级SSO集成
- 用户行为审计：记录所有用户操作日志
- 密码策略管理：支持复杂度要求和定期更换
- 多因素认证：支持双因子认证
- 批量用户管理：支持批量导入、导出用户
- 用户分组管理：按部门或职能创建用户组
- 权限模板：预设权限模板，快速分配权限
- 自助服务：用户可自助修改个人信息

**验收标准：**
- 支持至少6种角色类型的权限分配
- 用户新增、启用、禁用、删除、离职、重置密码操作均可正常执行
- 所有用户操作都有详细日志记录
- 用户管理操作响应时间小于3秒
- 批量操作支持至少1000个用户
- 密码重置后临时密码在指定时间内有效

#### 4.1.3 监控与告警
**功能描述：** 实时监控系统和Agent运行状态，提供告警功能
**用户故事：** 作为系统管理员，我希望能够及时了解系统和Agent的运行状况，并在出现问题时收到告警。

**监控指标字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| metricId | String | 是 | 指标唯一标识，系统自动生成 |
| metricName | String | 是 | 指标名称（如CPU使用率、响应时间、请求量等） |
| metricType | Enum | 是 | 指标类型：系统级、Agent级、模型级、MCP级 |
| targetId | String | 是 | 监控目标ID（Agent ID、模型ID等） |
| currentValue | Number | 是 | 当前值 |
| unit | String | 是 | 单位（%、ms、次/秒、个等） |
| trend | Enum | 是 | 趋势：上升、下降、平稳 |
| threshold | JSON | 是 | 阈值配置：警告阈值、严重阈值 |
| collectionInterval | Number | 是 | 采集间隔（秒），最小30秒 |
| retentionDays | Number | 是 | 数据保留天数，默认30天 |
| lastCollectTime | DateTime | 是 | 最近采集时间 |
| historyData | Array | 是 | 历史数据点列表（时间戳+值） |

**告警规则字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| ruleId | String | 是 | 规则唯一标识，系统自动生成 |
| ruleName | String | 是 | 规则名称，2-100字符 |
| description | Text | 否 | 规则描述，最大500字符 |
| isEnabled | Boolean | 是 | 是否启用，默认true |
| metricId | String | 是 | 关联的监控指标ID |
| condition | Enum | 是 | 条件：大于、小于、等于、大于等于、小于等于 |
| threshold | Number | 是 | 阈值 |
| duration | Number | 是 | 持续时间（秒），持续超过阈值才触发告警 |
| severity | Enum | 是 | 严重级别：信息、警告、严重、致命 |
| notifyChannels | Array | 是 | 通知渠道：邮件、短信、系统通知、Webhook |
| notifyUsers | Array | 是 | 接收告警的用户/用户组ID列表 |
| cooldownMinutes | Number | 否 | 冷却时间（分钟），同一告警重复通知间隔，默认30分钟 |
| createTime | DateTime | 是 | 创建时间 |
| updater | String | 是 | 更新人，系统自动记录最后修改人 |
| updateTime | DateTime | 是 | 更新时间 |
| creator | String | 是 | 创建人 |

**告警历史字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| alertId | String | 是 | 告警唯一标识，系统自动生成 |
| ruleId | String | 是 | 触发规则ID |
| ruleName | String | 是 | 触发规则名称 |
| severity | Enum | 是 | 严重级别：信息、警告、严重、致命 |
| targetId | String | 是 | 告警目标对象ID |
| targetName | String | 是 | 告警目标对象名称 |
| metricValue | Number | 是 | 触发时的指标值 |
| threshold | Number | 是 | 触发阈值 |
| message | Text | 是 | 告警详情描述 |
| status | Enum | 是 | 处理状态：未处理、处理中、已解决、已忽略 |
| assignee | String | 否 | 处理人 |
| resolveTime | DateTime | 否 | 解决时间 |
| resolveNote | Text | 否 | 处理说明 |
| notifyStatus | Enum | 是 | 通知状态：已发送、发送失败 |
| triggerTime | DateTime | 是 | 触发时间 |
| endTime | DateTime | 否 | 告警结束时间（指标恢复正常的时间） |

**告警通知方式配置字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| notifyId | String | 是 | 通知配置唯一标识 |
| channelType | Enum | 是 | 渠道类型：邮件、短信、系统通知、Webhook、企业微信、钉钉 |
| channelName | String | 是 | 渠道名称，2-50字符 |
| isEnabled | Boolean | 是 | 是否启用 |
| recipients | Array | 是 | 接收人列表（邮箱地址、手机号、用户ID等） |
| webhookUrl | String | 否 | Webhook URL（Webhook渠道时必填） |
| webhookSecret | String | 否 | Webhook签名密钥（加密存储） |
| templateId | String | 是 | 消息模板ID |
| severityFilter | Array | 否 | 接收的告警级别列表，空表示接收全部 |
| createTime | DateTime | 是 | 创建时间 |
| creator | String | 是 | 创建人 |

**具体需求：**
- Agent运行状态监控：CPU、内存、磁盘使用率等
- 性能指标监控：响应时间、吞吐量、成功率、错误率
- 自定义告警规则：基于阈值的自定义告警设置
- 实时告警通知：邮件、短信、系统通知
- 历史数据分析：长期趋势分析
- 告警历史记录：告警事件的详细记录

**验收标准：**
- 监控数据采集频率不超过30秒
- 告警响应时间小于5秒
- 支持至少10种预设监控指标

#### 4.1.4 首页与仪表盘
**功能描述：** 为用户提供个性化的信息展示和快速操作入口
**用户故事：** 作为普通用户，我希望在登录后能看到最重要的信息和常用功能，提高工作效率。

**首页仪表盘组件字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| componentId | String | 是 | 组件唯一标识，系统自动生成 |
| componentName | String | 是 | 组件名称（如系统概览、快捷操作、告警汇总等） |
| componentType | Enum | 是 | 组件类型：统计卡片、图表、列表、快捷入口、通知中心 |
| position | Number | 是 | 显示位置序号，数值越小越靠前 |
| size | Enum | 是 | 组件大小：小（1/4宽度）、中（1/2宽度）、大（全宽度） |
| isVisible | Boolean | 是 | 是否可见 |
| applicableRoles | Array | 是 | 适用角色列表（哪些角色可见此组件） |
| dataRefreshInterval | Number | 是 | 数据刷新间隔（秒），最小30秒 |
| config | JSON | 否 | 组件个性化配置 |

**系统概览卡数字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| cardId | String | 是 | 卡片唯一标识 |
| title | String | 是 | 卡片标题（如Agent总数、在线用户数等） |
| value | Number/String | 是 | 展示数值 |
| unit | String | 否 | 单位（个、%、次等） |
| trend | Number | 否 | 环比变化率（正数上升，负数下降） |
| icon | String | 是 | 图标标识 |
| link | String | 否 | 点击跳转链接 |
| color | String | 是 | 卡片主题色 |

**快捷操作配置字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| shortcutId | String | 是 | 快捷操作唯一标识 |
| name | String | 是 | 操作名称（如创建Agent、安装Skill等） |
| icon | String | 是 | 图标标识 |
| link | String | 是 | 跳转路由/链接 |
| sortOrder | Number | 是 | 排序序号 |
| applicableRoles | Array | 是 | 可用角色列表 |
| isPinned | Boolean | 是 | 是否固定显示 |

**通知中心字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| noticeId | String | 是 | 通知唯一标识 |
| title | String | 是 | 通知标题，最大100字符 |
| content | Text | 是 | 通知内容，最大2000字符 |
| type | Enum | 是 | 类型：系统通知、告警通知、任务提醒、版本更新 |
| severity | Enum | 是 | 级别：信息、警告、严重 |
| sender | String | 是 | 发送者（系统/用户） |
| targetUsers | Array | 否 | 目标用户列表，空表示全员通知 |
| isRead | Boolean | 是 | 当前用户是否已读 |
| readTime | DateTime | 否 | 阅读时间 |
| link | String | 否 | 关联链接 |
| expireTime | DateTime | 否 | 过期时间，过期后不再显示 |
| createTime | DateTime | 是 | 创建时间 |

**具体需求：**
- 个性化首页：基于用户角色和偏好的定制化展示
- 关键指标概览：系统健康度、Agent数量、运行状态等
- 快捷操作入口：常用功能的一键访问
- 通知和提醒中心：系统通知、告警信息、任务提醒
- 搜索功能：全局搜索Agent、Skill、工作流、模型等
- 数据可视化：图表和仪表盘展示关键数据

**验收标准：**
- 首页加载时间小于2秒
- 支持至少10种个性化组件
- 搜索响应时间小于1秒

#### 4.1.5 Skill商店
**功能描述：** 提供Skill的发现、安装、更新和管理功能，为Agent提供可使用的功能扩展
**用户故事：** 作为用户，我希望能够方便地找到并安装各种有用的Skill来增强Agent的功能。

**Skill 列表字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| skillId | String | 是 | Skill唯一标识，系统自动生成 |
| skillName | String | 是 | Skill名称，2-50字符 |
| description | Text | 是 | 功能描述，最大500字符 |
| icon | File | 否 | Skill图标，支持PNG/JPG/SVG，最大2MB |
| category | Enum | 是 | 分类：数据处理、工具调用、内容生成、搜索查询、系统集成、自定义 |
| tags | Array | 否 | 标签列表，最多20个 |
| version | String | 是 | 当前版本号 |
| author | String | 是 | 开发者/作者名称 |
| installCount | Number | 是 | 安装次数 |
| rating | Number | 是 | 平均评分，范围0.0-5.0 |
| ratingCount | Number | 是 | 评分人数 |
| status | Enum | 是 | 状态：未安装、已安装、有更新可用 |
| isOfficial | Boolean | 是 | 是否官方Skill |
| isFree | Boolean | 是 | 是否免费 |
| minAgentVersion | String | 否 | 最低兼容Agent版本 |
| createTime | DateTime | 是 | 上架时间 |
| updater | String | 是 | 更新人，系统自动记录最后修改人 |
| updateTime | DateTime | 是 | 更新时间 |

**Skill 详情字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| skillId | String | 是 | Skill唯一标识 |
| skillName | String | 是 | Skill名称 |
| description | Text | 是 | 详细描述，支持Markdown格式 |
| icon | File | 否 | 图标 |
| screenshots | Array | 否 | 截图列表，最多10张，支持PNG/JPG |
| category | Enum | 是 | 分类 |
| tags | Array | 否 | 标签列表 |
| version | String | 是 | 当前版本 |
| changelog | Text | 是 | 版本更新日志 |
| dependencies | Array | 否 | 依赖的其他Skill列表 |
| configSchema | JSON | 否 | 配置项Schema，JSON Schema格式 |
| author | String | 是 | 作者信息 |
| authorUrl | String | 否 | 作者主页 |
| documentation | String | 否 | 文档链接 |
| license | String | 否 | 许可证类型 |
| installCount | Number | 是 | 安装次数 |
| rating | Number | 是 | 平均评分 |
| installStatus | Enum | 是 | 安装状态：未安装、已安装、安装中、安装失败 |
| installedVersion | String | 否 | 已安装版本号（如果已安装） |
| hasUpdate | Boolean | 是 | 是否有可用更新 |

**Skill 评论字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| reviewId | String | 是 | 评论唯一标识 |
| skillId | String | 是 | Skill ID |
| userId | String | 是 | 评论用户ID |
| username | String | 是 | 评论用户名 |
| rating | Number | 是 | 评分，1-5星 |
| content | Text | 是 | 评论内容，最大1000字符 |
| isVerified | Boolean | 是 | 是否已安装用户（仅已安装用户可评论） |
| createTime | DateTime | 是 | 评论时间 |
| replyCount | Number | 是 | 回复数量 |

**Skill 安装记录字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| installId | String | 是 | 安装记录唯一标识 |
| skillId | String | 是 | Skill ID |
| skillName | String | 是 | Skill名称 |
| installedVersion | String | 是 | 安装的版本号 |
| installStatus | Enum | 是 | 安装状态：安装中、成功、失败、已卸载 |
| installUser | String | 是 | 操作人 |
| installTime | DateTime | 是 | 安装时间 |
| failReason | Text | 否 | 失败原因 |
| configData | JSON | 否 | 安装后的配置数据 |
| boundAgents | Array | 否 | 已绑定此Skill的Agent列表 |

**具体需求：**
- Skill分类浏览：按功能、行业、热度等维度分类
- Skill搜索功能：全文搜索、标签筛选
- Skill详情页面：功能介绍、使用方法、评价等
- Skill安装和更新：一键安装、自动更新
- 个人Skill管理：已安装Skill的管理
- Skill市场集成：与第三方Skill市场的对接
- Skill评价系统：用户评分和评论
- Skill推荐算法：基于使用习惯的智能推荐
- Skill可见性：仅对具有相应权限的Agent可用
- Skill关联：支持与特定Agent的关联配置
- Skill安全验证：上传前的安全验证和测试

**验收标准：**
- Skill安装成功率99%以上
- 支持在线更新功能
- 搜索结果响应时间小于1秒
- Agent只能使用已授权的Skill

#### 4.1.6 MCP管理
**功能描述：** 管理Model Context Protocol（MCP）服务和连接，为Agent提供模型上下文协议支持
**用户故事：** 作为开发者，我希望能够方便地配置和管理MCP服务，以便更好地为Agent提供不同AI模型的集成能力。

**MCP 服务列表字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| mcpId | String | 是 | MCP服务唯一标识，系统自动生成 |
| mcpName | String | 是 | 服务名称，2-50字符 |
| description | Text | 否 | 描述信息，最大500字符 |
| serverUrl | String | 是 | MCP服务器地址，有效的URL格式 |
| protocolVersion | Enum | 是 | 协议版本：v1.0、v1.1、v2.0 |
| transportType | Enum | 是 | 传输类型：stdio、sse、http |
| status | Enum | 是 | 状态：未连接、连接中、已连接、异常 |
| healthStatus | Enum | 是 | 健康状态：健康、亚健康、不健康 |
| responseTime | Number | 否 | 平均响应时间（毫秒） |
| boundAgentCount | Number | 是 | 已绑定Agent数量 |
| creator | String | 是 | 创建人 |
| createTime | DateTime | 是 | 创建时间 |
| updater | String | 是 | 更新人，系统自动记录最后修改人 |
| updateTime | DateTime | 是 | 更新时间 |
| lastConnectTime | DateTime | 否 | 最近连接时间 |
| errorCount | Number | 是 | 累计错误次数 |

**MCP 配置表单字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| mcpName | String | 是 | 服务名称，2-50字符，全局唯一 |
| description | Text | 否 | 描述信息，最大500字符 |
| serverUrl | String | 是 | MCP服务器地址 |
| protocolVersion | Enum | 是 | 协议版本：v1.0、v1.1、v2.0 |
| transportType | Enum | 是 | 传输类型：stdio、sse、http |
| authType | Enum | 是 | 认证方式：无认证、API Key、Bearer Token、OAuth2.0、Basic Auth |
| credentials | JSON | 否 | 认证凭据（加密存储），根据authType动态表单 |
| timeoutSeconds | Number | 否 | 连接超时（秒），范围5-300，默认30 |
| retryEnabled | Boolean | 否 | 是否启用自动重试，默认true |
| maxRetries | Number | 否 | 最大重试次数，范围0-10，默认3 |
| healthCheckUrl | String | 否 | 健康检查URL |
| healthCheckInterval | Number | 否 | 健康检查间隔（秒），范围10-300，默认60 |
| envVariables | JSON | 否 | 环境变量配置，键值对格式 |
| command | String | 否 | 启动命令（stdio传输方式时需要） |
| args | Array | 否 | 启动参数列表 |
| tags | Array | 否 | 标签列表 |
| templateId | String | 否 | 基于模板创建时选择模板ID |

**MCP 日志字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| logId | String | 是 | 日志唯一标识 |
| mcpId | String | 是 | MCP服务ID |
| logLevel | Enum | 是 | 日志级别：DEBUG、INFO、WARN、ERROR |
| message | Text | 是 | 日志内容 |
| requestUrl | String | 否 | 请求URL |
| statusCode | Number | 否 | 响应状态码 |
| responseTime | Number | 否 | 响应时间（毫秒） |
| errorCode | String | 否 | 错误码 |
| createTime | DateTime | 是 | 日志时间 |

**MCP 模板字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| templateId | String | 是 | 模板唯一标识 |
| templateName | String | 是 | 模板名称，2-50字符 |
| description | Text | 否 | 模板描述，最大200字符 |
| configPreset | JSON | 是 | 预置配置（URL、协议版本、认证方式等） |
| category | Enum | 是 | 分类：数据库、文件存储、搜索、代码工具、其他 |
| isOfficial | Boolean | 是 | 是否官方模板 |
| useCount | Number | 是 | 使用次数 |
| createTime | DateTime | 是 | 创建时间 |

**用户批量导入/导出字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| batchId | String | 是 | 批次唯一标识 |
| fileName | String | 是 | 导入/导出文件名 |
| fileType | Enum | 是 | 文件格式：CSV、Excel |
| totalRows | Number | 是 | 总数据行数 |
| successRows | Number | 是 | 成功处理行数 |
| failRows | Number | 是 | 失败行数 |
| failDetails | Array | 否 | 失败行详情（行号+错误原因） |
| operator | String | 是 | 操作人 |
| operationType | Enum | 是 | 操作类型：导入、导出 |
| status | Enum | 是 | 状态：处理中、成功、部分成功、失败 |
| createTime | DateTime | 是 | 操作时间 |
| completeTime | DateTime | 否 | 完成时间 |

**具体需求：**
- MCP服务配置：MCP服务器地址、认证信息、连接参数
- MCP状态监控：连接状态、服务健康度、响应时间
- MCP权限管理：不同用户对MCP服务的访问权限
- MCP日志查看：详细的连接和交互日志
- MCP性能分析：使用统计、错误率、响应时间分析
- MCP模板管理：常用MCP配置的模板
- MCP故障恢复：自动重连和故障转移
- MCP可见性：仅对具有相应权限的Agent可用
- MCP关联：支持与特定Agent的关联配置
- MCP安全验证：连接前的安全验证和测试

**验收标准：**
- MCP连接建立时间小于3秒
- 支持至少5种MCP协议版本
- 自动故障恢复成功率95%以上
- Agent只能使用已授权的MCP服务

#### 4.1.7 模型管理
**功能描述：** 管理平台接入的大语言模型（LLM）资源，支持模型的注册、配置、启用/禁用等操作，为Agent提供可选用的模型列表
**用户故事：** 作为系统管理员，我希望能够统一管理平台接入的各类大模型（如 DeepSeek、GPT-4o、Claude 等），包括配置 API 连接信息、调整模型参数、控制模型的可用状态，以便为 Agent 提供灵活的模型选择能力。

**模型列表字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| modelId | String | 是 | 模型唯一标识，系统自动生成 |
| modelName | String | 是 | 模型名称，2-50字符 |
| provider | Enum | 是 | 提供商：OpenAI、Anthropic、DeepSeek、阿里通义、百度文心、智谱、Google、Meta、本地部署、其他 |
| apiType | Enum | 是 | API类型：OpenAI兼容、Anthropic、自定义 |
| status | Enum | 是 | 状态：已启用、已禁用、异常 |
| capabilities | Array | 是 | 能力标签：对话、补全、函数调用、多模态、JSON输出、Structured Output |
| boundAgentCount | Number | 是 | 已绑定Agent数量 |
| avgResponseTime | Number | 否 | 平均响应时间（毫秒） |
| totalCalls | Number | 是 | 累计调用次数 |
| todayCalls | Number | 是 | 今日调用次数 |
| todayTokenCount | Number | 是 | 今日Token消耗量 |
| cost | Number | 是 | 今日调用成本（元） |
| quotaUsed | Number | 否 | 已使用配额 |
| quotaTotal | Number | 否 | 总配额限制 |
| createTime | DateTime | 是 | 创建时间 |
| updater | String | 是 | 更新人，系统自动记录最后修改人 |
| updateTime | DateTime | 是 | 更新时间 |

**模型新增/编辑表单字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| modelName | String | 是 | 模型名称，2-50字符，全局唯一 |
| provider | Enum | 是 | 提供商 |
| apiType | Enum | 是 | API类型：OpenAI兼容、Anthropic、自定义 |
| baseUrl | String | 是 | API端点地址，有效的URL格式 |
| apiKey | String | 是 | API密钥（加密存储），编辑时可留空表示不修改 |
| timeoutSeconds | Number | 否 | 超时时间（秒），范围5-300，默认30 |
| maxRetries | Number | 否 | 最大重试次数，范围0-10，默认3 |
| maxTokens | Number | 否 | 最大Token数上限，范围1-200000 |
| minTemperature | Number | 否 | 温度下限，范围0.0-2.0，默认0.0 |
| maxTemperature | Number | 否 | 温度上限，范围0.0-2.0，默认2.0 |
| defaultTemperature | Number | 否 | 默认温度，范围0.0-2.0，默认1.0 |
| defaultTopP | Number | 否 | 默认Top-P，范围0.0-1.0 |
| defaultTopK | Number | 否 | 默认Top-K，范围1-100 |
| capabilities | Array | 是 | 能力标签多选：对话、补全、函数调用、工具调用、多模态输入、JSON输出、Structured Output |
| inputTypes | Array | 是 | 支持的输入类型：文本、图片、音频、视频 |
| outputTypes | Array | 是 | 支持的输出类型：文本、JSON、图片 |
| description | Text | 否 | 模型描述，最大500字符 |
| category | String | 否 | 分类/分组名称 |
| inputPrice | Number | 否 | 输入Token单价（元/百万Token），非负数 |
| outputPrice | Number | 否 | 输出Token单价（元/百万Token），非负数 |
| dailyTokenQuota | Number | 否 | 每日Token配额上限，0表示不限 |
| dailyRequestQuota | Number | 否 | 每日请求配额上限，0表示不限 |
| qpsLimit | Number | 否 | QPS限制（每秒请求数），0表示不限 |
| tpmLimit | Number | 否 | TPM限制（每分钟Token数），0表示不限 |
| isEnabled | Boolean | 是 | 是否启用，默认true |
| sortOrder | Number | 否 | 列表排序序号，数值越小越靠前 |

**模型详情字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| modelId | String | 是 | 模型唯一标识 |
| modelName | String | 是 | 模型名称 |
| provider | Enum | 是 | 提供商 |
| apiType | Enum | 是 | API类型 |
| baseUrl | String | 是 | API端点地址 |
| status | Enum | 是 | 状态 |
| capabilities | Array | 是 | 能力标签列表 |
| inputTypes | Array | 是 | 支持的输入类型 |
| outputTypes | Array | 是 | 支持的输出类型 |
| config | JSON | 是 | 完整配置信息（不含API Key明文） |
| pricing | JSON | 是 | 价格配置（输入/输出单价） |
| quota | JSON | 是 | 配额配置 |
| rateLimit | JSON | 是 | 速率限制配置 |
| boundAgents | Array | 是 | 已绑定Agent列表 |
| healthCheckResult | Enum | 否 | 最近连通性测试结果：通过、失败、未测试 |
| lastTestTime | DateTime | 否 | 最近测试时间 |
| statistics | JSON | 是 | 统计数据（调用次数、Token消耗、成本等） |
| createTime | DateTime | 是 | 创建时间 |
| updater | String | 是 | 更新人，系统自动记录最后修改人 |
| updateTime | DateTime | 是 | 更新时间 |

**模型调用监控字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| modelId | String | 是 | 模型ID |
| timestamp | DateTime | 是 | 统计时间 |
| requestCount | Number | 是 | 请求次数 |
| successCount | Number | 是 | 成功次数 |
| failCount | Number | 是 | 失败次数 |
| avgResponseTime | Number | 是 | 平均响应时间（毫秒） |
| p95ResponseTime | Number | 是 | P95响应时间（毫秒） |
| inputTokens | Number | 是 | 输入Token总数 |
| outputTokens | Number | 是 | 输出Token总数 |
| totalTokens | Number | 是 | Token总数 |
| totalCost | Number | 是 | 总成本（元） |
| activeAgents | Number | 是 | 使用该模型的活跃Agent数 |

**具体需求：**
- 模型新增：支持添加各类 LLM 模型（如 DeepSeek、OpenAI GPT 系列、Anthropic Claude、通义千问、百度文心等），填写模型名称、提供商、API 类型
- 连接配置：配置模型的 API Key、Base URL（支持自定义端点）、超时时间、重试策略
- 参数设置：配置最大 Token 数、温度范围、Top-P、Top-K、频率惩罚等推理参数的默认值和可调范围
- 能力标签：标记模型支持的能力类型（对话/补全、函数调用/工具调用、多模态输入、JSON 输出、Structured Output 等）
- 启用/禁用：控制模型是否对平台可用，禁用后已绑定该模型的 Agent 将收到提示
- 模型删除：删除不再使用的模型配置，删除前需检查是否有关联的 Agent
- 修改配置：更新 API 连接信息、调整参数范围、修改能力标签
- 模型测试：提供模型连通性测试功能，验证 API Key 和连接配置是否正确
- 模型分组/分类：按提供商或用途对模型进行分类管理
- 成本配置：记录模型的计费方式（按 Token 计费），配置输入/输出 Token 的单价，用于成本统计
- 模型可见性：仅对具有相应权限的 Agent 可用
- 模型关联：支持与特定 Agent 的关联配置
- 配额管理：可设置模型的使用配额限制（如每日最大 Token 数、最大请求数）
- 速率限制：可配置模型的调用频率限制（QPS/TPM 限制）

**验收标准：**
- 支持至少 10 种主流 LLM 模型的配置管理
- 模型连通性测试响应时间小于 5 秒
- 模型启用/禁用状态变更对 Agent 的影响时间小于 10 秒
- Agent 只能使用平台内已注册且启用的模型
- API Key 等敏感信息必须加密存储
- 删除已关联 Agent 的模型时必须有明确的拦截提示

### 4.2 前端功能需求

#### 4.2.1 管理端界面
**目标用户：** 系统管理员、企业IT管理者
**主要功能：**

1. 个性化首页展示
   - 系统概览卡片
   - 关键指标统计
   - 最近活动日志
   - 快捷操作按钮

2. 仪表盘展示关键指标
   - 系统健康度
   - Agent运行状态统计
   - 模型使用情况统计
   - 性能指标图表
   - 告警信息汇总

3. Agent管理界面
   - Agent列表和详细信息
   - 批量操作功能
   - 搜索和筛选功能
   - 导入导出功能
   - Agent基础配置（名称、描述、参数等）
   - Skill配置（Skill绑定、权限、参数）
   - MCP配置（MCP绑定、连接参数、状态监控）
   - 工作流管理（工作流关联、工具化配置、参数传递）
   - 模型选择和配置

4. 模型管理界面
   - 模型列表（名称、提供商、状态、能力标签）
   - 新增/编辑/删除模型
   - 启用/禁用模型（切换开关）
   - 模型连接配置（API Key、Base URL、超时设置）
   - 参数配置（最大 Token、温度范围、Top-P 等）
   - 能力标签管理（对话、函数调用、多模态等）
   - 成本配置（输入/输出 Token 单价）
   - 连通性测试按钮
   - 配额和速率限制设置
   - 搜索和筛选功能（按提供商、状态、能力标签）

5. Skill商店管理
   - Skill市场浏览
   - 安装管理
   - 更新通知

6. MCP管理界面
   - MCP服务列表
   - 状态监控
   - 配置管理

7. 配置管理界面
   - 系统参数设置
   - 用户偏好设置

**系统配置字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| configKey | String | 是 | 配置键，唯一标识 |
| configValue | String/JSON | 是 | 配置值 |
| configType | Enum | 是 | 配置类型：字符串、数字、布尔值、JSON |
| description | Text | 否 | 配置说明 |
| isPublic | Boolean | 是 | 是否公开配置（前端可读取） |
| isModifiable | Boolean | 是 | 是否允许运行时修改 |
| updateTime | DateTime | 是 | 最后更新时间 |
| updater | String | 是 | 最后修改人 |

**系统参数配置项：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| maxAgentsPerUser | Number | 是 | 每个用户最大Agent数量，默认50 |
| maxConcurrentAgents | Number | 是 | 系统最大并发Agent数，默认1000 |
| defaultModel | String | 是 | 默认模型ID |
| maxUploadFileSize | Number | 是 | 最大上传文件大小（MB），默认50 |
| sessionTimeout | Number | 是 | 会话超时时间（分钟），默认60 |
| passwordMinLength | Number | 是 | 密码最小长度，默认8 |
| passwordRequireUpper | Boolean | 是 | 密码是否要求大写，默认true |
| passwordRequireLower | Boolean | 是 | 密码是否要求小写，默认true |
| passwordRequireNumber | Boolean | 是 | 密码是否要求数字，默认true |
| passwordRequireSpecial | Boolean | 是 | 密码是否要求特殊字符，默认true |
| passwordExpireDays | Number | 是 | 密码过期天数，0表示不过期，默认90 |
| maxLoginFailures | Number | 是 | 最大登录失败次数，默认5 |
| lockDuration | Number | 是 | 账号锁定时长（分钟），默认30 |
| enableMfa | Boolean | 是 | 是否强制MFA，默认false |
| enableSso | Boolean | 是 | 是否启用SSO，默认false |
| dataRetentionDays | Number | 是 | 数据保留天数（日志等），默认365 |

9. 用户管理界面
   - 用户列表管理
   - 用户详细信息查看（姓名、昵称、手机号、邮箱、备注、来源等）
   - 用户操作：新增、启用、禁用、删除、离职
   - 重置密码功能
   - 用户导入导出功能
   - 用户分组管理
   - 权限分配功能

10. 权限配置界面
    - 角色管理
    - 权限矩阵
    - 审批流程设置
    - 权限模板管理

11. 监控图表和报表
    - 实时监控面板
    - 历史数据报表
    - 自定义图表

**监控图表配置字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| chartId | String | 是 | 图表唯一标识 |
| chartName | String | 是 | 图表名称，2-50字符 |
| chartType | Enum | 是 | 图表类型：折线图、柱状图、饼图、面积图、仪表盘、热力图 |
| metrics | Array | 是 | 关联指标列表（指标ID+聚合方式） |
| timeRange | Enum | 是 | 时间范围：最近1小时、6小时、24小时、7天、30天 |
| refreshInterval | Number | 是 | 刷新间隔（秒），最小30秒 |
| dimensions | Array | 否 | 维度字段列表（用于分组展示） |
| threshold | JSON | 否 | 阈值线配置（警告线、严重线） |
| sortOrder | Number | 是 | 显示排序 |

**历史报表字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| reportId | String | 是 | 报表唯一标识 |
| reportName | String | 是 | 报表名称 |
| reportType | Enum | 是 | 报表类型：Agent性能、模型调用、Skill使用、系统资源 |
| timeRange | JSON | 是 | 时间范围（开始时间、结束时间） |
| metrics | Array | 是 | 包含的指标列表 |
| format | Enum | 是 | 导出格式：PDF、Excel、CSV |
| schedule | Enum | 否 | 生成周期：单次、每日、每周、每月 |
| recipients | Array | 否 | 报表接收人列表 |
| status | Enum | 是 | 状态：生成中、已完成、生成失败 |
| fileUrl | String | 否 | 报表文件下载链接 |
| createTime | DateTime | 是 | 创建时间 |
| generateTime | DateTime | 否 | 生成完成时间 |

12. 告警管理界面
    - 告警规则设置
    - 告警历史
    - 通知方式配置

**管理端通用组件字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| 搜索关键词 | String | 否 | 全局搜索输入，支持模糊匹配 |
| 筛选条件 | JSON | 否 | 动态筛选配置（状态、类型、时间范围等） |
| 排序字段 | String | 否 | 排序依据字段 |
| 排序方式 | Enum | 是 | 排序方式：升序、降序 |
| 分页页码 | Number | 是 | 当前页码，从1开始，默认1 |
| 每页条数 | Number | 是 | 每页显示条数，可选10/20/50/100，默认20 |
| 选中项列表 | Array | 否 | 批量操作选中的数据ID列表 |
| 操作日志 | Array | 是 | 页面操作日志记录 |

**全局搜索字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| keyword | String | 是 | 搜索关键词，1-100字符 |
| searchScope | Array | 是 | 搜索范围：Agent、Skill、MCP、模型、工作流、用户 |
| results | Array | 是 | 搜索结果列表（包含类型、名称、ID、跳转链接） |
| recentSearches | Array | 是 | 最近搜索记录，最多10条 |
| hotSearches | Array | 是 | 热门搜索词列表 |

**批量操作字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| operationType | Enum | 是 | 操作类型：启用、停用、删除、导出、分配权限 |
| selectedIds | Array | 是 | 选中项ID列表 |
| confirmAction | Boolean | 是 | 是否已确认操作 |
| operationResult | Enum | 是 | 操作结果：成功、部分成功、失败 |
| successCount | Number | 是 | 成功数量 |
| failCount | Number | 是 | 失败数量 |
| failDetails | Array | 否 | 失败项详情列表 |

#### 4.2.2 用户端界面
**目标用户：** 普通用户、业务用户
**主要功能：**

1. 个性化首页
   - 个人仪表盘
   - 常用Agent快捷入口
   - 通知提醒

2. Agent交互界面
   - 聊天界面
   - 参数配置
   - 结果展示

3. Skill使用界面
   - 可用Skill列表
   - Skill配置和调用

**用户端 Skill 使用字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| skillId | String | 是 | Skill ID |
| skillName | String | 是 | Skill名称 |
| skillDescription | Text | 是 | Skill功能说明 |
| skillVersion | String | 是 | Skill版本 |
| configFields | JSON | 否 | Skill可配置字段定义（供用户填写） |
| userConfig | JSON | 否 | 用户填写的配置值 |
| lastUsedTime | DateTime | 否 | 最近使用时间 |
| useCount | Number | 是 | 用户使用次数 |
| isAvailable | Boolean | 是 | 当前是否可用 |

5. 模型信息查看
   - 当前 Agent 使用的模型展示
   - 可用模型列表（由管理员配置的已启用模型）
   - 模型基本信息和能力说明（只读，不可修改配置）

5. 个人中心
   - 个人信息管理
   - 安全设置
   - 使用历史

6. 历史记录查看
   - Agent交互历史
   - 模型调用历史
   - Skill使用记录

7. 设置选项
   - 界面偏好
   - 通知设置
   - 数据导出

**用户通知设置字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| userId | String | 是 | 用户ID |
| emailNotify | Boolean | 是 | 邮件通知开关，默认开启 |
| smsNotify | Boolean | 是 | 短信通知开关，默认关闭 |
| inAppNotify | Boolean | 是 | 站内通知开关，默认开启 |
| agentStatusChange | Boolean | 是 | Agent状态变更通知，默认开启 |
| alertNotify | Boolean | 是 | 告警通知，默认开启 |
| systemUpdate | Boolean | 是 | 系统更新通知，默认开启 |
| taskReminder | Boolean | 是 | 任务提醒，默认开启 |
| quietHoursStart | String | 否 | 免打扰开始时间（HH:mm），如22:00 |
| quietHoursEnd | String | 否 | 免打扰结束时间（HH:mm），如08:00 |
| notifyFrequency | Enum | 是 | 通知频率：实时、每小时汇总、每天汇总 |

**数据导出字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| exportId | String | 是 | 导出任务唯一标识 |
| exportType | Enum | 是 | 导出类型：交互历史、调用记录、使用统计 |
| timeRange | JSON | 是 | 时间范围（开始时间、结束时间） |
| format | Enum | 是 | 导出格式：CSV、Excel、JSON |
| status | Enum | 是 | 状态：处理中、已完成、失败 |
| fileUrl | String | 否 | 下载链接（完成后生成） |
| expireTime | DateTime | 否 | 下载链接过期时间 |
| createTime | DateTime | 是 | 创建时间 |
| completeTime | DateTime | 否 | 完成时间 |

8. 帮助文档
    - 使用指南
    - FAQ
    - 联系支持

**用户端界面 - 登录页字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| username | String | 是 | 用户名/邮箱，3-50字符 |
| password | String | 是 | 密码，8-32字符，输入时掩码显示 |
| rememberMe | Boolean | 否 | 记住登录状态，默认关闭 |
| mfaCode | String | 否 | 双因素验证码6位数字（开启MFA时必填） |
| loginMethod | Enum | 是 | 登录方式：账号密码、SSO、手机号验证码 |
| phone | String | 否 | 手机号（选择手机号登录时必填） |
| smsCode | String | 否 | 短信验证码（选择手机号登录时必填） |
| captcha | String | 否 | 图形验证码（登录失败3次后显示） |
| loginResult | Enum | 是 | 登录结果：成功、失败-用户名错误、失败-密码错误、失败-账号锁定、失败-验证码错误 |
| lockRemainingTime | Number | 否 | 账号锁定剩余时间（分钟） |
| ssoProviders | Array | 否 | 可用的SSO提供商列表 |

**用户端界面 - Agent聊天页字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| agentId | String | 是 | 当前对话Agent ID |
| agentName | String | 是 | Agent名称，只读展示 |
| sessionId | String | 是 | 会话ID，新建会话时系统生成 |
| messages | Array | 是 | 消息列表（角色、内容、时间、附件） |
| inputContent | String | 否 | 用户输入内容，最大5000字符 |
| attachments | Array | 否 | 附件列表（文件类型、URL、大小） |
| modelUsed | String | 是 | 当前使用模型名称 |
| temperature | Number | 否 | 温度参数（若Agent允许用户调整） |
| maxTokens | Number | 否 | 最大Token数（若允许调整） |
| streamEnabled | Boolean | 否 | 是否流式输出，默认true |
| availableSkills | Array | 是 | 当前Agent可用的Skill列表 |
| usedSkills | Array | 否 | 本次对话已使用的Skill |
| isStreaming | Boolean | 是 | 是否正在流式响应中 |
| isLoading | Boolean | 是 | 是否正在加载 |
| errorMessage | String | 否 | 错误信息（请求失败时展示） |

**用户端界面 - 个人中心字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| userId | String | 是 | 用户唯一标识 |
| username | String | 是 | 用户名，只读 |
| realName | String | 是 | 真实姓名，2-50字符 |
| email | String | 是 | 邮箱地址 |
| phone | String | 否 | 手机号 |
| avatar | File | 否 | 头像，支持PNG/JPG，最大1MB |
| department | String | 否 | 所属部门 |
| role | Enum | 是 | 角色，只读 |
| language | Enum | 是 | 界面语言：简体中文、繁体中文、English |
| theme | Enum | 是 | 界面主题：浅色、深色、跟随系统 |
| timezone | String | 是 | 时区设置，如Asia/Shanghai |
| newPassword | String | 否 | 新密码（修改密码时必填） |
| oldPassword | String | 否 | 旧密码（修改密码时必填） |
| mfaEnabled | Boolean | 是 | 是否启用双因素认证 |
| mfaSecret | String | 否 | MFA密钥（开启时展示二维码） |
| emailNotifications | Boolean | 否 | 是否接收邮件通知，默认开启 |
| systemNotifications | Boolean | 否 | 是否接收系统通知，默认开启 |
| lastPasswordChange | DateTime | 是 | 最近密码修改时间 |

**用户端界面 - 交互历史字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| historyId | String | 是 | 历史记录唯一标识 |
| sessionId | String | 是 | 会话ID |
| agentId | String | 是 | Agent ID |
| agentName | String | 是 | Agent名称 |
| title | String | 是 | 会话标题，自动生成或用户自定义 |
| messageCount | Number | 是 | 消息轮次数 |
| modelUsed | String | 是 | 使用的模型 |
| tokenUsage | Number | 是 | Token消耗总量 |
| cost | Number | 是 | 调用成本（元） |
| skillsUsed | Array | 否 | 使用的Skill列表 |
| duration | Number | 是 | 会话时长（秒） |
| status | Enum | 是 | 状态：进行中、已完成、异常终止 |
| startTime | DateTime | 是 | 会话开始时间 |
| endTime | DateTime | 否 | 会话结束时间 |
| createTime | DateTime | 是 | 创建时间 |

**用户端界面 - 可用模型列表字段设计：**

| 字段名 | 字段类型 | 是否必填 | 说明/约束 |
|--------|----------|----------|-----------|
| modelId | String | 是 | 模型ID |
| modelName | String | 是 | 模型名称 |
| provider | Enum | 是 | 提供商 |
| capabilities | Array | 是 | 能力标签 |
| inputTypes | Array | 是 | 支持的输入类型 |
| outputTypes | Array | 是 | 支持的输出类型 |
| description | Text | 否 | 模型描述 |
| isAvailable | Boolean | 是 | 当前是否可用 |
| costInfo | String | 否 | 成本信息展示（元/百万Token） |

## 5. 技术架构

### 5.1 系统架构概览
- **前端层：** React 18 + TypeScript + Ant Design，支持Admin端和User端
- **后端层：** Java 21 + Spring Boot 3.x + Spring AI + Spring AI Alibaba，RESTful API
- **数据库：** MySQL 8.x（主数据）+ Redis（缓存）
- **消息队列：** RocketMQ（异步处理和事件驱动）
- **存储：** 本地存储 + MinIO / AWS S3（大文件和模型文件存储）
- **容器化：** Docker + Kubernetes + Helm

### 5.2 关键技术组件
- **身份认证：** Spring Security + JWT + OAuth2.0 + LDAP/Active Directory
- **AI框架：** Spring AI + Spring AI Alibaba（统一AI模型调用、多模型适配、Prompt管理、RAG支持）
- **消息队列：** RocketMQ（异步处理、事件驱动、消息可靠投递）
- **日志系统：** ELK Stack（Elasticsearch, Logstash, Kibana）
- **监控系统：** Prometheus + Grafana + Jaeger（链路追踪）
- **API网关：** Spring Cloud Gateway
- **工作流引擎：** Temporal.io / LiteFlow
- **技能管理系统：** 插件化设计 + SPI扩展机制
- **MCP协议支持：** Spring AI MCP Client
- **模型管理：** Spring AI Model Registry + 自定义模型服务
- **模型存储：** MinIO / AWS S3（模型文件存储）
- **数据访问：** MyBatis Plus / Spring Data JPA
- **实时通信：** WebSocket + SSE（Server-Sent Events）
- **可视化引擎：** AntV G6（工作流可视化）

### 5.3 数据库设计
- **用户表：** 用户基本信息、角色权限
- **用户组表：** 用户分组信息、权限配置
- **用户组关联表：** 用户与用户组的关联关系
- **权限模板表：** 预设权限模板
- **用户操作日志表：** 详细记录用户操作
- **Agent表：** Agent配置、状态、统计数据
- **Skill表：** Skill元数据、版本信息
- **工作流表：** 工作流定义、执行记录
- **MCP配置表：** MCP服务配置信息
- **模型表：** 模型基本信息（名称、提供商、API类型、API Key、Base URL、参数配置、能力标签、状态、成本配置、配额限制等）
- **Agent资源关联表：** Agent与模型、Skill、MCP、工作流的关联关系
- **日志表：** 用户操作日志、系统日志

## 6. 非功能性需求

### 6.1 性能要求
- 系统响应时间：<2秒
- 页面加载时间：<3秒
- 支持并发用户数：≥1000
- Agent平均响应时间：<1秒
- 工作流执行延迟：<5秒
- Skill加载时间：<3秒
- 模型推理响应时间：<2秒（根据模型复杂度可配置）
- 模型部署时间：<5分钟
- 用户管理操作响应时间：<3秒
- 系统可用性：≥99.9%
- 支持同时运行工作流实例：≥500
- 数据库查询响应时间：<100毫秒

### 6.2 安全要求
- 数据传输加密：TLS 1.3
- 数据存储加密：AES-256
- 遵循GDPR等数据保护法规
- 定期安全审计
- 漏洞扫描和修复机制
- 审计日志完整性保证
- API速率限制和防滥用
- 资源访问权限控制

### 6.3 可扩展性
- 支持水平扩展
- 微服务架构
- 插件化设计
- 第三方集成支持
- API版本管理
- 数据库分片支持

### 6.4 兼容性
- 浏览器兼容：Chrome 90+, Firefox 88+, Safari 14+
- 移动端适配：响应式设计
- 屏幕分辨率：支持1366x768及以上

## 7. 用户体验设计

### 7.1 设计原则
- 简洁直观的用户界面
- 一致的交互体验
- 无障碍访问支持（WCAG 2.1 AA级）
- 响应式设计
- 遵循Material Design和Ant Design规范

### 7.2 用户流程
1. **新用户注册/登录**
   - 访问平台主页
   - 选择注册或登录方式
   - 完成身份验证
   - 完善个人信息（首次登录）

2. **访问个性化首页**
   - 登录后跳转到个性化首页
   - 查看系统概览和重要通知
   - 访问快捷操作入口

3. **管理员用户管理**
   - 进入用户管理页面
   - 查看用户列表和详细信息
   - 进行用户状态管理（激活/停用/锁定）
   - 批量操作用户（导入/导出/编辑）
   - 创建或管理用户分组
   - 分配用户权限

4. **上传或配置模型**
   - 进入模型管理页面
   - 上传新模型或选择现有模型
   - 配置模型参数和资源分配
   - 部署模型

5. **从Skill商店安装所需Skill**
   - 浏览Skill商店
   - 搜索或筛选需要的Skill
   - 查看Skill详情和评价
   - 安装Skill

6. **配置MCP连接**
   - 进入MCP管理页面
   - 添加新的MCP服务配置
   - 测试连接
   - 配置连接参数

7. **创建Agent**
   - 从首页进入Agent管理页面
   - 选择创建新Agent
   - 配置Agent基本信息和参数（基础配置）
   - 从模型管理中选择已注册模型
   - 从Skill商店中选择已安装Skill（Skill配置）
   - 从MCP管理中选择已配置MCP服务（MCP配置）
   - 选择可用的工作流作为Agent工具（工作流管理）
   - 发布Agent

8. **配置Agent参数**
   - 选择需要配置的Agent
   - 修改配置参数
   - 关联模型、Skill、MCP和工作流
   - 保存配置

9. **启动Agent并监控**
    - 启动Agent
    - 监控Agent运行状态
    - 查看性能指标和模型使用情况

10. **查看监控报告**
    - 访问监控仪表盘
    - 查看历史数据和趋势
    - 导出报告

### 7.3 界面设计规范
- 颜色主题：深蓝为主色调，灰色辅助，橙色强调
- 字体：中文PingFang SC/苹方，英文Inter/Roboto
- 间距：遵循8px网格系统
- 图标：Ant Design图标库

## 8. 项目计划

### 8.1 开发阶段

#### Phase 1: 基础框架 (Week 1-4)
- 项目结构搭建
- 技术栈选型和环境配置
- 后端基础服务开发（认证、用户管理）
- 前端基础框架搭建
- 数据库设计和搭建
- API文档编写

**交付物：**
- 基础框架代码
- 用户认证系统
- 数据库结构
- API文档

#### Phase 2: 核心功能 (Week 5-12)
- Agent管理功能开发
- 用户权限系统完善
- 用户管理功能开发
- 基础监控功能
- 个性化首页开发
- 模型基础功能开发
- MCP基础功能
- 资源关联功能开发
- API测试和优化

**交付物：**
- Agent CRUD功能
- 完整权限系统
- 用户管理系统
- 基础监控面板
- 首页仪表盘
- 模型管理基础功能（模型注册、配置、启用/禁用）
- 资源关联功能

#### Phase 3: 增强功能 (Week 13-20)
- Skill商店开发
- MCP高级管理功能
- 工作流引擎开发
- 模型管理增强功能（连通性测试、成本统计、配额管理、速率限制）
- 用户管理增强功能（批量操作、分组管理等）
- Agent资源关联增强功能
- Agent工作流集成增强功能
- 高级监控和告警
- 性能优化
- 安全加固
- 用户体验优化

**交付物：**
- Skill商店系统
- MCP管理系统
- 模型管理系统
- 用户管理系统
- Agent资源关联系统
- 完整监控告警系统

#### Phase 4: 测试与发布 (Week 21-24)
- 全面功能测试
- 性能压力测试
- 安全渗透测试
- 用户验收测试
- Bug修复和优化
- 生产环境部署
- 文档完善

**交付物：**
- 测试报告
- 修复后的系统
- 部署文档
- 用户手册

### 8.2 里程碑
- **M1:** 完成基础架构搭建 (Month 1)
- **M2:** 完成核心功能开发 (Month 3)
- **M3:** 完成增强功能开发 (Month 5)
- **M4:** 产品发布 (Month 6)

### 8.3 团队构成
- 项目经理：1人
- 前端开发：2人
- 后端开发：2人
- ML工程师：1人
- DevOps工程师：1人
- 测试工程师：1人
- UI/UX设计师：1人

## 9. 风险评估

### 9.1 技术风险
- **AI Agent兼容性问题：** 不同AI模型和协议的兼容性挑战
  - 风险等级：中等
  - 影响：功能完整性
  - 缓解措施：制定通用接口规范，预留扩展点

- **Agent工作流集成复杂性：** Agent与工作流的关联和工具化配置
  - 风险等级：中等
  - 影响：开发进度
  - 缓解措施：采用成熟的集成方案，逐步迭代

- **MCP协议集成挑战：** 与不同MCP实现的兼容性
  - 风险等级：高
  - 影响：系统稳定性
  - 缓解措施：深入了解协议规范，建立测试套件

- **模型管理复杂性：** 多种模型格式的支持和性能优化
  - 风险等级：中等
  - 影响：开发进度和系统性能
  - 缓解措施：采用成熟的模型服务框架，分阶段实施

- **用户管理复杂性：** 用户权限和分组管理的复杂逻辑
  - 风险等级：中等
  - 影响：开发进度和用户体验
  - 缓解措施：采用成熟的用户管理框架，分阶段实施

- **资源关联复杂性：** Agent与模型、Skill、MCP、工作流的复杂关联
  - 风险等级：中等
  - 影响：系统设计复杂度
  - 缓解措施：清晰的设计模式，分步实施

- **性能瓶颈：** 大量Agent并发运行时的性能问题
  - 风险等级：高
  - 影响：用户体验
  - 缓解措施：性能测试贯穿开发过程，架构层面考虑扩展性

- **安全漏洞：** 企业数据和AI模型的安全风险
  - 风险等级：高
  - 影响：企业信誉
  - 缓解措施：安全设计先行，定期安全审计

### 9.2 项目风险
- **需求变更：** 客户需求变化影响开发进度
  - 风险等级：中等
  - 影响：项目延期
  - 缓解措施：需求冻结机制，变更控制流程

- **人员变动：** 关键人员离职影响项目
  - 风险等级：低
  - 影响：开发进度
  - 缓解措施：知识共享，文档完善

### 9.3 市场风险
- **竞争加剧：** 类似产品的出现
  - 风险等级：中等
  - 影响：市场份额
  - 缓解措施：快速迭代，差异化功能

- **用户需求变化：** 市场需求的快速变化
  - 风险等级：中等
  - 影响：产品适应性
  - 缓解措施：敏捷开发，持续反馈

## 10. 成功指标

### 10.1 产品指标
- 用户活跃度 (DAU/MAU)：目标DAU 500，MAU 2000
- Agent管理效率提升：相比传统方式提升60%
- 模型管理效率提升：模型部署时间从小时级缩短到分钟级
- 用户管理效率提升：用户权限分配时间从小时级缩短到分钟级
- 系统稳定运行时间：99.9%可用性
- 用户满意度评分：85%以上
- Agent发布时间：从小时级缩短到分钟级
- 模型部署时间：从小时级缩短到分钟级
- 技能安装成功率：99%以上
- 工作流执行成功率：98%以上
- 仪表盘加载速度：<2秒
- 模型推理延迟：<2秒
- 资源关联准确性：100%
- 用户管理操作响应时间：<3秒
- 批量用户操作成功率：99%以上

### 10.2 商业指标
- 用户获取成本 (CAC)：目标低于$50
- 客户生命周期价值 (LTV)：目标高于$2000
- 月度经常性收入 (MRR)：目标第一年$50K
- 客户留存率：目标90%（月度）
- 客户流失率：目标低于5%（季度）

## 11. 附录

### 11.1 术语表
- **Agent：** 智能代理程序，可执行特定任务的AI实体
- **PRD：** Product Requirement Document，产品需求文档
- **SSO：** Single Sign-On，单点登录
- **MCP：** Model Context Protocol，模型上下文协议
- **Skill：** 功能模块或插件，用于扩展Agent功能
- **工作流：** 业务流程自动化系统，由多个节点组成
- **模型：** 大语言模型（LLM），如 DeepSeek、GPT-4o、Claude、通义千问等，通过 API 调用的 AI 模型
- **模型管理：** 对平台接入的 LLM 模型进行管理，包括注册、API 配置、参数设置、启用/禁用、测试等
- **资源关联：** Agent与平台内资源（模型、Skill、MCP、工作流）的绑定关系
- **用户管理：** 平台用户的注册、权限分配、状态管理等功能
- **API：** Application Programming Interface，应用程序编程接口
- **UI/UX：** User Interface/User Experience，用户界面/用户体验
- **DevOps：** Development Operations，开发运维一体化

### 11.2 参考资料
- 《AI Agent设计模式》
- 《企业级应用架构设计》
- 《用户体验设计最佳实践》
- 《微服务架构实战》
- 《机器学习模型部署指南》
- 《用户权限管理系统设计》
- 《安全开发指南》

### 11.3 相关文档
- 技术架构文档
- API接口文档
- 部署运维手册
- 用户操作手册
- 测试计划文档

---

**文档版本：** 5.4  
**最后更新：** 2026年04月28日  
**作者：** GAgentManager 产品团队  
**更新说明：** Agent部署统一改为发布；增强Agent版本控制概念（语义化版本号、版本状态、版本对比、灰度测试、配置快照、回滚追踪）  
**审核人：** 产品负责人、技术负责人、业务负责人