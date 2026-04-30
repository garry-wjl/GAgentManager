-- ============================================================================
-- GAgentManager 数据库初始化脚本
-- 数据库: MySQL 8.x
-- 框架: Spring Boot 3.x + MyBatis Plus 3.5.x
-- 架构: DDD 六层 (facade -> client -> domain -> infra -> application -> adapter)
-- 字符集: utf8mb4
-- ============================================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `gagent_manager`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `gagent_manager`;

-- ============================================================================
-- 1. 用户表 (user)
-- ============================================================================
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id`              BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `username`        VARCHAR(64)  NOT NULL                COMMENT '登录账号(手机号/邮箱)',
    `password_hash`   VARCHAR(255) NOT NULL                COMMENT 'BCrypt密码哈希',
    `real_name`       VARCHAR(64)  DEFAULT NULL            COMMENT '真实姓名',
    `nickname`        VARCHAR(64)  DEFAULT NULL            COMMENT '昵称',
    `phone`           VARCHAR(20)  DEFAULT NULL            COMMENT '手机号',
    `email`           VARCHAR(128) DEFAULT NULL            COMMENT '邮箱',
    `source`          VARCHAR(20)  DEFAULT 'MANUAL'        COMMENT '来源: MANUAL/IMPORT/SSO/INVITE/API',
    `status`          VARCHAR(20)  DEFAULT 'ENABLED'       COMMENT '状态: ENABLED/DISABLED/RESIGNED/DELETED',
    `department`      VARCHAR(128) DEFAULT NULL            COMMENT '部门',
    `avatar`          VARCHAR(512) DEFAULT NULL            COMMENT '头像URL',
    `notes`           VARCHAR(500) DEFAULT NULL            COMMENT '备注',
    `mfa_enabled`     TINYINT(1)   DEFAULT 0               COMMENT '是否开启MFA',
    `last_login_time` DATETIME     DEFAULT NULL            COMMENT '最后登录时间',
    `last_login_ip`   VARCHAR(64)  DEFAULT NULL            COMMENT '最后登录IP',
    `login_fail_count`INT          DEFAULT 0               COMMENT '连续登录失败次数',
    `expire_time`     DATETIME     DEFAULT NULL            COMMENT '账号过期时间',
    `num`             VARCHAR(64)  DEFAULT NULL            COMMENT '编号',
    `create_no`       VARCHAR(64)  DEFAULT NULL            COMMENT '创建人编号',
    `update_no`       VARCHAR(64)  DEFAULT NULL            COMMENT '更新人编号',
    `create_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`         TINYINT(1)   DEFAULT 0               COMMENT '逻辑删除: 0-正常 1-已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    KEY `idx_phone` (`phone`),
    KEY `idx_email` (`email`),
    KEY `idx_status` (`status`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================================================
-- 2. 角色表 (role)
-- ============================================================================
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `role_code`   VARCHAR(64)  NOT NULL                COMMENT '角色编码',
    `role_name`   VARCHAR(128) NOT NULL                COMMENT '角色名称',
    `description` VARCHAR(500) DEFAULT NULL            COMMENT '描述',
    `is_system`   TINYINT(1)   DEFAULT 0               COMMENT '是否系统内置(不可删除)',
    `is_enabled`  TINYINT(1)   DEFAULT 1               COMMENT '是否启用',
    `num`         VARCHAR(64)  DEFAULT NULL            COMMENT '编号',
    `create_no`   VARCHAR(64)  DEFAULT NULL            COMMENT '创建人编号',
    `update_no`   VARCHAR(64)  DEFAULT NULL            COMMENT '更新人编号',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`     TINYINT(1)   DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_code` (`role_code`),
    KEY `idx_is_enabled` (`is_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- ============================================================================
-- 3. 权限资源表 (permission_resource)
-- ============================================================================
DROP TABLE IF EXISTS `permission_resource`;
CREATE TABLE `permission_resource` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `resource_code` VARCHAR(128) NOT NULL                COMMENT '资源编码',
    `resource_name` VARCHAR(128) NOT NULL                COMMENT '资源名称',
    `resource_type` VARCHAR(20)  NOT NULL                COMMENT '资源类型: MODULE/MENU/BUTTON/API',
    `parent_id`     BIGINT       DEFAULT 0               COMMENT '父级资源ID',
    `sort_order`    INT          DEFAULT 0               COMMENT '排序',
    `num`           VARCHAR(64)  DEFAULT NULL            COMMENT '编号',
    `create_no`     VARCHAR(64)  DEFAULT NULL            COMMENT '创建人编号',
    `update_no`     VARCHAR(64)  DEFAULT NULL            COMMENT '更新人编号',
    `create_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`       TINYINT(1)   DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_resource_code` (`resource_code`),
    KEY `idx_parent_id` (`parent_id`),
    KEY `idx_resource_type` (`resource_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限资源表';

-- ============================================================================
-- 4. 权限动作表 (permission_action)
-- ============================================================================
DROP TABLE IF EXISTS `permission_action`;
CREATE TABLE `permission_action` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `action_code` VARCHAR(32)  NOT NULL                COMMENT '动作编码: read/create/update/delete/admin',
    `action_name` VARCHAR(64)  NOT NULL                COMMENT '动作名称',
    `description` VARCHAR(256) DEFAULT NULL            COMMENT '描述',
    `num`         VARCHAR(64)  DEFAULT NULL            COMMENT '编号',
    `create_no`   VARCHAR(64)  DEFAULT NULL            COMMENT '创建人编号',
    `update_no`   VARCHAR(64)  DEFAULT NULL            COMMENT '更新人编号',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`     TINYINT(1)   DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_action_code` (`action_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限动作表';

-- ============================================================================
-- 5. 角色权限关联表 (role_permission)
-- ============================================================================
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission` (
    `id`              BIGINT      NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `role_id`         BIGINT      NOT NULL               COMMENT '角色ID',
    `resource_id`     BIGINT      NOT NULL               COMMENT '资源ID',
    `action_id`       BIGINT      NOT NULL               COMMENT '动作ID',
    `permission_code` VARCHAR(256) NOT NULL              COMMENT '权限编码: resourceCode:actionCode',
    `grant_type`      VARCHAR(16) NOT NULL DEFAULT 'ALLOW' COMMENT '授权类型: ALLOW/DENY',
    `num`             VARCHAR(64) DEFAULT NULL           COMMENT '编号',
    `create_no`       VARCHAR(64) DEFAULT NULL           COMMENT '创建人编号',
    `update_no`       VARCHAR(64) DEFAULT NULL           COMMENT '更新人编号',
    `create_time`     DATETIME    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`     DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`         TINYINT(1)  DEFAULT 0              COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_resource_action` (`role_id`, `resource_id`, `action_id`),
    KEY `idx_role_id` (`role_id`),
    KEY `idx_permission_code` (`permission_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- ============================================================================
-- 6. 用户角色关联表 (user_role)
-- ============================================================================
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
    `id`          BIGINT      NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id`     BIGINT      NOT NULL                COMMENT '用户ID',
    `role_id`     BIGINT      NOT NULL                COMMENT '角色ID',
    `assign_type` VARCHAR(20) DEFAULT 'DIRECT'        COMMENT '关联类型: DIRECT/INHERITED',
    `assign_time` DATETIME    DEFAULT CURRENT_TIMESTAMP COMMENT '关联时间',
    `assign_user` VARCHAR(64) DEFAULT NULL            COMMENT '操作人',
    `expire_time` DATETIME    DEFAULT NULL            COMMENT '过期时间(空表示永久)',
    `num`         VARCHAR(64) DEFAULT NULL            COMMENT '编号',
    `create_no`   VARCHAR(64) DEFAULT NULL            COMMENT '创建人编号',
    `update_no`   VARCHAR(64) DEFAULT NULL            COMMENT '更新人编号',
    `create_time` DATETIME    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`     TINYINT(1)  DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
    KEY `idx_role_id` (`role_id`),
    KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- ============================================================================
-- 7. 审计日志表 (audit_log)
-- ============================================================================
DROP TABLE IF EXISTS `audit_log`;
CREATE TABLE `audit_log` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `operator_id`   BIGINT       NOT NULL                COMMENT '操作人ID',
    `operator_name` VARCHAR(64)  NOT NULL                COMMENT '操作人名称',
    `resource_type` VARCHAR(64)  NOT NULL                COMMENT '资源类型',
    `resource_id`   BIGINT       DEFAULT NULL            COMMENT '资源ID',
    `action`        VARCHAR(64)  NOT NULL                COMMENT '操作动作',
    `detail`        TEXT         DEFAULT NULL            COMMENT '操作详情(JSON)',
    `ip_address`    VARCHAR(64)  DEFAULT NULL            COMMENT 'IP地址',
    `user_agent`    VARCHAR(512) DEFAULT NULL            COMMENT 'User-Agent',
    `result`        VARCHAR(20)  DEFAULT NULL            COMMENT '结果: SUCCESS/FAIL',
    `error_msg`     VARCHAR(1000) DEFAULT NULL           COMMENT '错误信息',
    `num`           VARCHAR(64)  DEFAULT NULL            COMMENT '编号',
    `create_no`     VARCHAR(64)  DEFAULT NULL            COMMENT '创建人编号',
    `update_no`     VARCHAR(64)  DEFAULT NULL            COMMENT '更新人编号',
    `create_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`       TINYINT(1)   DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_operator_id` (`operator_id`),
    KEY `idx_resource_type` (`resource_type`),
    KEY `idx_create_time` (`create_time`),
    KEY `idx_result` (`result`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='审计日志表';

-- ============================================================================
-- 8. 系统配置表 (system_config)
-- ============================================================================
DROP TABLE IF EXISTS `system_config`;
CREATE TABLE `system_config` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `config_key`    VARCHAR(128) NOT NULL                COMMENT '配置键',
    `config_value`  TEXT         DEFAULT NULL            COMMENT '配置值',
    `config_type`   VARCHAR(32)  DEFAULT 'STRING'        COMMENT '类型: STRING/NUMBER/BOOLEAN/JSON',
    `description`   VARCHAR(500) DEFAULT NULL            COMMENT '描述',
    `is_public`     TINYINT(1)   DEFAULT 0               COMMENT '是否公开(用户端可见)',
    `is_modifiable` TINYINT(1)   DEFAULT 1               COMMENT '是否可修改',
    `num`           VARCHAR(64)  DEFAULT NULL            COMMENT '编号',
    `create_no`     VARCHAR(64)  DEFAULT NULL            COMMENT '创建人编号',
    `update_no`     VARCHAR(64)  DEFAULT NULL            COMMENT '更新人编号',
    `create_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`       TINYINT(1)   DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- ============================================================================
-- 9. 通知表 (notice)
-- ============================================================================
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title`       VARCHAR(256) NOT NULL                COMMENT '标题',
    `content`     TEXT         NOT NULL                COMMENT '内容',
    `type`        VARCHAR(32)  DEFAULT 'INFO'          COMMENT '类型: INFO/WARNING/ERROR/SYSTEM',
    `severity`    VARCHAR(16)  DEFAULT 'LOW'           COMMENT '严重程度: LOW/MEDIUM/HIGH/CRITICAL',
    `sender`      VARCHAR(64)  DEFAULT NULL            COMMENT '发送人',
    `target_users` TEXT        DEFAULT NULL            COMMENT '目标用户ID列表(JSON)',
    `link`        VARCHAR(512) DEFAULT NULL            COMMENT '跳转链接',
    `expire_time` DATETIME     DEFAULT NULL            COMMENT '过期时间',
    `num`         VARCHAR(64)  DEFAULT NULL            COMMENT '编号',
    `create_no`   VARCHAR(64)  DEFAULT NULL            COMMENT '创建人编号',
    `update_no`   VARCHAR(64)  DEFAULT NULL            COMMENT '更新人编号',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`     TINYINT(1)   DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_type` (`type`),
    KEY `idx_severity` (`severity`),
    KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- ============================================================================
-- 10. 模型表 (model)
-- ============================================================================
DROP TABLE IF EXISTS `model`;
CREATE TABLE `model` (
    `id`                    BIGINT         NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `model_code`            VARCHAR(64)    NOT NULL                COMMENT '模型编码',
    `model_name`            VARCHAR(128)   NOT NULL                COMMENT '模型名称',
    `provider`              VARCHAR(64)    NOT NULL                COMMENT '提供商: OpenAI/Anthropic/DeepSeek等',
    `api_type`              VARCHAR(32)    DEFAULT 'openai'        COMMENT 'API类型',
    `description`           VARCHAR(1000)  DEFAULT NULL            COMMENT '描述',
    `category`              VARCHAR(64)    DEFAULT NULL            COMMENT '分类',
    `sort_order`            INT            DEFAULT 0               COMMENT '排序',
    `api_key`               VARCHAR(512)   DEFAULT NULL            COMMENT 'API密钥(加密存储)',
    `base_url`              VARCHAR(512)   DEFAULT NULL            COMMENT 'API地址',
    `timeout`               INT            DEFAULT 30              COMMENT '超时时间(秒)',
    `retry_count`           INT            DEFAULT 3               COMMENT '重试次数',
    `max_tokens`            INT            DEFAULT NULL            COMMENT '最大Token数',
    `min_temperature`       DECIMAL(5,2)   DEFAULT NULL            COMMENT '最低temperature',
    `max_temperature`       DECIMAL(5,2)   DEFAULT NULL            COMMENT '最高temperature',
    `default_temperature`   DECIMAL(5,2)   DEFAULT 1.00            COMMENT '默认temperature',
    `default_top_p`         DECIMAL(5,2)   DEFAULT 1.00            COMMENT '默认top_p',
    `default_top_k`         INT            DEFAULT NULL            COMMENT '默认top_k',
    `capabilities`          JSON           DEFAULT NULL            COMMENT '能力标签JSON',
    `input_types`           JSON           DEFAULT NULL            COMMENT '支持的输入类型JSON',
    `output_types`          JSON           DEFAULT NULL            COMMENT '支持的输出类型JSON',
    `status`                VARCHAR(20)    DEFAULT 'ENABLED'       COMMENT '状态: ENABLED/DISABLED/ERROR',
    `connectivity_status`   VARCHAR(20)    DEFAULT 'UNTESTED'      COMMENT '连通状态: UNTESTED/CONNECTED/ERROR',
    `last_test_time`        DATETIME       DEFAULT NULL            COMMENT '最后测试时间',
    `test_error_message`    VARCHAR(1000)  DEFAULT NULL            COMMENT '测试错误信息',
    `num`                   VARCHAR(64)    DEFAULT NULL            COMMENT '编号',
    `create_no`             VARCHAR(64)    DEFAULT NULL            COMMENT '创建人编号',
    `update_no`             VARCHAR(64)    DEFAULT NULL            COMMENT '更新人编号',
    `create_time`           DATETIME       DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`           DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`               TINYINT(1)     DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_model_code` (`model_code`),
    KEY `idx_provider` (`provider`),
    KEY `idx_status` (`status`),
    KEY `idx_connectivity_status` (`connectivity_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型表';

-- ============================================================================
-- 11. Agent表 (agent)
-- ============================================================================
DROP TABLE IF EXISTS `agent`;
CREATE TABLE `agent` (
    `id`                 BIGINT         NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `agent_code`         VARCHAR(64)    NOT NULL                COMMENT 'Agent编码',
    `agent_name`         VARCHAR(128)   NOT NULL                COMMENT 'Agent名称',
    `agent_type`         VARCHAR(32)    NOT NULL                COMMENT '类型: CHAT/WORKFLOW/ANALYSIS/AUTOMATION/HYBRID',
    `description`        VARCHAR(1000)  DEFAULT NULL            COMMENT '描述',
    `icon_url`           VARCHAR(512)   DEFAULT NULL            COMMENT '图标URL',
    `tags`               JSON           DEFAULT NULL            COMMENT '标签JSON',
    `admins`             JSON           DEFAULT NULL            COMMENT '管理员列表JSON',
    `status`             VARCHAR(20)    DEFAULT 'DRAFT'         COMMENT '状态: DRAFT/PUBLISHED/ONLINE/OFFLINE/ABNORMAL/PUBLISHING',
    `version`            VARCHAR(32)    DEFAULT 'V1.0.0'        COMMENT '当前版本号',
    `system_prompt`      TEXT           DEFAULT NULL            COMMENT '系统提示词',
    `temperature`        DECIMAL(5,2)   DEFAULT NULL            COMMENT 'temperature参数',
    `max_tokens`         INT            DEFAULT NULL            COMMENT '最大Token数',
    `top_p`              DECIMAL(5,2)   DEFAULT NULL            COMMENT 'top_p参数',
    `top_k`              INT            DEFAULT NULL            COMMENT 'top_k参数',
    `frequency_penalty`  DECIMAL(5,2)   DEFAULT NULL            COMMENT 'frequency_penalty',
    `presence_penalty`   DECIMAL(5,2)   DEFAULT NULL            COMMENT 'presence_penalty',
    `stop_sequences`     JSON           DEFAULT NULL            COMMENT '停止序列JSON',
    `response_format`    VARCHAR(32)    DEFAULT NULL            COMMENT '响应格式: text/json',
    `timeout_seconds`    INT            DEFAULT NULL            COMMENT '超时时间(秒)',
    `retry_count`        INT            DEFAULT NULL            COMMENT '重试次数',
    `num`                VARCHAR(64)    DEFAULT NULL            COMMENT '编号',
    `create_no`          VARCHAR(64)    DEFAULT NULL            COMMENT '创建人编号',
    `update_no`          VARCHAR(64)    DEFAULT NULL            COMMENT '更新人编号',
    `create_time`        DATETIME       DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`        DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`            TINYINT(1)     DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_agent_code` (`agent_code`),
    KEY `idx_status` (`status`),
    KEY `idx_agent_type` (`agent_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Agent表';

-- ============================================================================
-- 12. Agent版本表 (agent_version)
-- ============================================================================
DROP TABLE IF EXISTS `agent_version`;
CREATE TABLE `agent_version` (
    `id`               BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `agent_id`         BIGINT       NOT NULL               COMMENT 'Agent ID',
    `version`          VARCHAR(32)  NOT NULL               COMMENT '版本号',
    `version_tag`      VARCHAR(64)  DEFAULT NULL           COMMENT '版本标签',
    `changelog`        TEXT         DEFAULT NULL           COMMENT '变更日志',
    `config_snapshot`  JSON         DEFAULT NULL           COMMENT '配置快照JSON',
    `creator`          VARCHAR(64)  DEFAULT NULL           COMMENT '创建人',
    `publish_time`     DATETIME     DEFAULT NULL           COMMENT '发布时间',
    `is_current`       TINYINT(1)   DEFAULT 0              COMMENT '是否当前版本',
    `num`              VARCHAR(64)  DEFAULT NULL           COMMENT '编号',
    `create_no`        VARCHAR(64)  DEFAULT NULL           COMMENT '创建人编号',
    `update_no`        VARCHAR(64)  DEFAULT NULL           COMMENT '更新人编号',
    `create_time`      DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`          TINYINT(1)   DEFAULT 0              COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_agent_id` (`agent_id`),
    KEY `idx_version` (`version`),
    KEY `idx_is_current` (`is_current`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Agent版本表';

-- ============================================================================
-- 13. Agent资源绑定表 (agent_resource_binding)
-- ============================================================================
DROP TABLE IF EXISTS `agent_resource_binding`;
CREATE TABLE `agent_resource_binding` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `agent_id`      BIGINT       NOT NULL                COMMENT 'Agent ID',
    `resource_type` VARCHAR(32)  NOT NULL                COMMENT '资源类型: MODEL/SKILL/MCP/WORKFLOW',
    `resource_id`   BIGINT       NOT NULL                COMMENT '资源ID',
    `is_default`    TINYINT(1)   DEFAULT 0               COMMENT '是否默认',
    `sort_order`    INT          DEFAULT 0               COMMENT '排序',
    `config`        JSON         DEFAULT NULL            COMMENT '绑定配置JSON',
    `num`           VARCHAR(64)  DEFAULT NULL            COMMENT '编号',
    `create_no`     VARCHAR(64)  DEFAULT NULL            COMMENT '创建人编号',
    `update_no`     VARCHAR(64)  DEFAULT NULL            COMMENT '更新人编号',
    `create_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`       TINYINT(1)   DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_agent_id` (`agent_id`),
    KEY `idx_resource_type` (`resource_type`),
    UNIQUE KEY `uk_agent_resource` (`agent_id`, `resource_type`, `resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Agent资源绑定表';

-- ============================================================================
-- 14. MCP服务表 (mcp_service)
-- ============================================================================
DROP TABLE IF EXISTS `mcp_service`;
CREATE TABLE `mcp_service` (
    `id`                    BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `mcp_code`              VARCHAR(64)  NOT NULL                COMMENT 'MCP编码',
    `mcp_name`              VARCHAR(128) NOT NULL                COMMENT 'MCP名称',
    `description`           VARCHAR(1000) DEFAULT NULL           COMMENT '描述',
    `latest_version`        VARCHAR(32)  DEFAULT NULL            COMMENT '最新版本',
    `current_version`       VARCHAR(32)  DEFAULT NULL            COMMENT '当前版本',
    `is_enabled`            TINYINT(1)   DEFAULT 1               COMMENT '是否启用',
    `status`                VARCHAR(20)  DEFAULT 'UNCONNECTED'   COMMENT '状态: UNCONNECTED/CONNECTING/CONNECTED/ERROR',
    `bound_agent_count`     INT          DEFAULT 0               COMMENT '绑定Agent数量',
    `server_url`            VARCHAR(512) DEFAULT NULL            COMMENT '服务器地址',
    `protocol_version`      VARCHAR(16)  DEFAULT 'v1.0'          COMMENT '协议版本',
    `transport_type`        VARCHAR(16)  DEFAULT 'sse'           COMMENT '传输类型: stdio/sse/http',
    `auth_type`             VARCHAR(32)  DEFAULT '无认证'        COMMENT '认证方式',
    `credentials`           TEXT         DEFAULT NULL            COMMENT '认证凭据(加密)',
    `timeout_seconds`       INT          DEFAULT 30              COMMENT '超时时间(秒)',
    `retry_enabled`         TINYINT(1)   DEFAULT 1               COMMENT '是否启用重试',
    `max_retries`           INT          DEFAULT 3               COMMENT '最大重试次数',
    `health_check_url`      VARCHAR(512) DEFAULT NULL            COMMENT '健康检查URL',
    `health_check_interval` INT          DEFAULT 60              COMMENT '健康检查间隔(秒)',
    `env_variables`         JSON         DEFAULT NULL            COMMENT '环境变量JSON',
    `command`               VARCHAR(512) DEFAULT NULL            COMMENT '启动命令',
    `args`                  TEXT         DEFAULT NULL            COMMENT '启动参数',
    `last_connect_time`     DATETIME     DEFAULT NULL            COMMENT '最后连接时间',
    `error_count`           INT          DEFAULT 0               COMMENT '错误次数',
    `num`                   VARCHAR(64)  DEFAULT NULL            COMMENT '编号',
    `create_no`             VARCHAR(64)  DEFAULT NULL            COMMENT '创建人编号',
    `update_no`             VARCHAR(64)  DEFAULT NULL            COMMENT '更新人编号',
    `create_time`           DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`           DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`               TINYINT(1)   DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_mcp_code` (`mcp_code`),
    KEY `idx_is_enabled` (`is_enabled`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MCP服务表';

-- ============================================================================
-- 15. MCP版本表 (mcp_version)
-- ============================================================================
DROP TABLE IF EXISTS `mcp_version`;
CREATE TABLE `mcp_version` (
    `id`              BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `mcp_id`          BIGINT       NOT NULL               COMMENT 'MCP服务ID',
    `version`         VARCHAR(32)  NOT NULL               COMMENT '版本号',
    `version_tag`     VARCHAR(64)  DEFAULT 'DRAFT'        COMMENT '版本标签',
    `changelog`       TEXT         DEFAULT NULL           COMMENT '变更日志',
    `config_snapshot` JSON         DEFAULT NULL           COMMENT '配置快照',
    `creator`         VARCHAR(64)  DEFAULT NULL           COMMENT '创建人',
    `publish_time`    DATETIME     DEFAULT NULL           COMMENT '发布时间',
    `is_current`      TINYINT(1)   DEFAULT 0              COMMENT '是否当前版本',
    `num`             VARCHAR(64)  DEFAULT NULL           COMMENT '编号',
    `create_no`       VARCHAR(64)  DEFAULT NULL           COMMENT '创建人编号',
    `update_no`       VARCHAR(64)  DEFAULT NULL           COMMENT '更新人编号',
    `create_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`         TINYINT(1)   DEFAULT 0              COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_mcp_id` (`mcp_id`),
    KEY `idx_version` (`version`),
    KEY `idx_is_current` (`is_current`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MCP版本表';

-- ============================================================================
-- 16. MCP日志表 (mcp_log)
-- ============================================================================
DROP TABLE IF EXISTS `mcp_log`;
CREATE TABLE `mcp_log` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `mcp_id`        BIGINT       NOT NULL               COMMENT 'MCP服务ID',
    `log_level`     VARCHAR(16)  NOT NULL               COMMENT '日志级别: DEBUG/INFO/WARN/ERROR',
    `message`       TEXT         DEFAULT NULL           COMMENT '日志内容',
    `request_url`   VARCHAR(512) DEFAULT NULL           COMMENT '请求URL',
    `status_code`   INT          DEFAULT NULL           COMMENT 'HTTP状态码',
    `response_time` INT          DEFAULT NULL           COMMENT '响应时间(ms)',
    `error_code`    VARCHAR(64)  DEFAULT NULL           COMMENT '错误码',
    `num`           VARCHAR(64)  DEFAULT NULL           COMMENT '编号',
    `create_no`     VARCHAR(64)  DEFAULT NULL           COMMENT '创建人编号',
    `update_no`     VARCHAR(64)  DEFAULT NULL           COMMENT '更新人编号',
    `create_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`       TINYINT(1)   DEFAULT 0              COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_mcp_id` (`mcp_id`),
    KEY `idx_log_level` (`log_level`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MCP日志表';

-- ============================================================================
-- 17. MCP模板表 (mcp_template)
-- ============================================================================
DROP TABLE IF EXISTS `mcp_template`;
CREATE TABLE `mcp_template` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `template_name` VARCHAR(128) NOT NULL               COMMENT '模板名称',
    `description`   VARCHAR(1000) DEFAULT NULL          COMMENT '描述',
    `config_preset` JSON         DEFAULT NULL           COMMENT '预设配置',
    `category`      VARCHAR(64)  DEFAULT NULL           COMMENT '分类',
    `is_official`   TINYINT(1)   DEFAULT 0              COMMENT '是否官方',
    `use_count`     INT          DEFAULT 0              COMMENT '使用次数',
    `num`           VARCHAR(64)  DEFAULT NULL           COMMENT '编号',
    `create_no`     VARCHAR(64)  DEFAULT NULL           COMMENT '创建人编号',
    `update_no`     VARCHAR(64)  DEFAULT NULL           COMMENT '更新人编号',
    `create_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`       TINYINT(1)   DEFAULT 0              COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_category` (`category`),
    KEY `idx_is_official` (`is_official`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MCP模板表';

-- ============================================================================
-- 18. Skill表 (skill)
-- ============================================================================
DROP TABLE IF EXISTS `skill`;
CREATE TABLE `skill` (
    `id`               BIGINT         NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `skill_code`       VARCHAR(64)    NOT NULL                COMMENT 'Skill编码',
    `skill_name`       VARCHAR(128)   NOT NULL                COMMENT 'Skill名称',
    `description`      VARCHAR(1000)  DEFAULT NULL            COMMENT '描述',
    `icon`             VARCHAR(512)   DEFAULT NULL            COMMENT '图标URL',
    `category`         VARCHAR(64)    DEFAULT NULL            COMMENT '分类',
    `tags`             JSON           DEFAULT NULL            COMMENT '标签JSON',
    `version`          VARCHAR(32)    DEFAULT 'V1.0.0'        COMMENT '当前版本',
    `author`           VARCHAR(64)    DEFAULT NULL            COMMENT '作者',
    `install_count`    INT            DEFAULT 0               COMMENT '安装次数',
    `rating`           DECIMAL(3,2)   DEFAULT 0.00            COMMENT '评分(0-5)',
    `rating_count`     INT            DEFAULT 0               COMMENT '评分次数',
    `status`           VARCHAR(32)    DEFAULT 'NOT_INSTALLED' COMMENT '状态: NOT_INSTALLED/INSTALLING/INSTALLED/DISABLED',
    `is_official`      TINYINT(1)     DEFAULT 0               COMMENT '是否官方',
    `is_free`          TINYINT(1)     DEFAULT 1               COMMENT '是否免费',
    `min_agent_version` VARCHAR(32)   DEFAULT NULL            COMMENT '最低Agent版本要求',
    `num`              VARCHAR(64)    DEFAULT NULL            COMMENT '编号',
    `create_no`        VARCHAR(64)    DEFAULT NULL            COMMENT '创建人编号',
    `update_no`        VARCHAR(64)    DEFAULT NULL            COMMENT '更新人编号',
    `create_time`      DATETIME       DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`      DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`          TINYINT(1)     DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_skill_code` (`skill_code`),
    KEY `idx_category` (`category`),
    KEY `idx_status` (`status`),
    KEY `idx_is_official` (`is_official`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Skill表';

-- ============================================================================
-- 19. Skill版本表 (skill_version)
-- ============================================================================
DROP TABLE IF EXISTS `skill_version`;
CREATE TABLE `skill_version` (
    `id`              BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `skill_id`        BIGINT       NOT NULL               COMMENT 'Skill ID',
    `version`         VARCHAR(32)  NOT NULL               COMMENT '版本号',
    `version_tag`     VARCHAR(64)  DEFAULT NULL           COMMENT '版本标签',
    `changelog`       TEXT         DEFAULT NULL           COMMENT '变更日志',
    `config_snapshot` JSON         DEFAULT NULL           COMMENT '配置快照',
    `creator`         VARCHAR(64)  DEFAULT NULL           COMMENT '创建人',
    `publish_time`    DATETIME     DEFAULT NULL           COMMENT '发布时间',
    `is_current`      TINYINT(1)   DEFAULT 0              COMMENT '是否当前版本',
    `num`             VARCHAR(64)  DEFAULT NULL           COMMENT '编号',
    `create_no`       VARCHAR(64)  DEFAULT NULL           COMMENT '创建人编号',
    `update_no`       VARCHAR(64)  DEFAULT NULL           COMMENT '更新人编号',
    `create_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`         TINYINT(1)   DEFAULT 0              COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_skill_id` (`skill_id`),
    KEY `idx_version` (`version`),
    KEY `idx_is_current` (`is_current`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Skill版本表';

-- ============================================================================
-- 20. Skill安装记录表 (skill_install_record)
-- ============================================================================
DROP TABLE IF EXISTS `skill_install_record`;
CREATE TABLE `skill_install_record` (
    `id`                BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `skill_id`          BIGINT       NOT NULL               COMMENT 'Skill ID',
    `skill_name`        VARCHAR(128) DEFAULT NULL           COMMENT 'Skill名称',
    `installed_version` VARCHAR(32)  NOT NULL               COMMENT '安装版本',
    `install_status`    VARCHAR(20)  DEFAULT 'INSTALLING'   COMMENT '状态: INSTALLING/SUCCESS/FAIL/UNINSTALLED',
    `install_user`      VARCHAR(64)  DEFAULT NULL           COMMENT '安装人',
    `install_time`      DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '安装时间',
    `fail_reason`       VARCHAR(1000) DEFAULT NULL          COMMENT '失败原因',
    `config_data`       JSON         DEFAULT NULL           COMMENT '安装配置JSON',
    `bound_agents`      JSON         DEFAULT NULL           COMMENT '绑定Agent列表JSON',
    `num`               VARCHAR(64)  DEFAULT NULL           COMMENT '编号',
    `create_no`         VARCHAR(64)  DEFAULT NULL           COMMENT '创建人编号',
    `update_no`         VARCHAR(64)  DEFAULT NULL           COMMENT '更新人编号',
    `create_time`       DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`           TINYINT(1)   DEFAULT 0              COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_skill_id` (`skill_id`),
    KEY `idx_install_status` (`install_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Skill安装记录表';

-- ============================================================================
-- 21. Skill评价表 (skill_review)
-- ============================================================================
DROP TABLE IF EXISTS `skill_review`;
CREATE TABLE `skill_review` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `skill_id`    BIGINT       NOT NULL               COMMENT 'Skill ID',
    `user_id`     BIGINT       NOT NULL               COMMENT '用户ID',
    `username`    VARCHAR(64)  DEFAULT NULL           COMMENT '用户名称',
    `rating`      INT          NOT NULL               COMMENT '评分(1-5)',
    `content`     VARCHAR(2000) DEFAULT NULL          COMMENT '评价内容',
    `is_verified` TINYINT(1)   DEFAULT 0              COMMENT '是否已验证(已购买)',
    `reply_count` INT          DEFAULT 0              COMMENT '回复数',
    `num`         VARCHAR(64)  DEFAULT NULL           COMMENT '编号',
    `create_no`   VARCHAR(64)  DEFAULT NULL           COMMENT '创建人编号',
    `update_no`   VARCHAR(64)  DEFAULT NULL           COMMENT '更新人编号',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`     TINYINT(1)   DEFAULT 0              COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_skill_id` (`skill_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Skill评价表';

-- ============================================================================
-- 22. 会话表 (chat_session)
-- ============================================================================
DROP TABLE IF EXISTS `chat_session`;
CREATE TABLE `chat_session` (
    `id`              BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id`         BIGINT       NOT NULL               COMMENT '用户ID',
    `agent_id`        BIGINT       NOT NULL               COMMENT 'Agent ID',
    `session_title`   VARCHAR(256) DEFAULT NULL           COMMENT '会话标题',
    `message_count`   INT          DEFAULT 0              COMMENT '消息数量',
    `last_message_time` DATETIME   DEFAULT NULL           COMMENT '最后消息时间',
    `num`             VARCHAR(64)  DEFAULT NULL           COMMENT '编号',
    `create_no`       VARCHAR(64)  DEFAULT NULL           COMMENT '创建人编号',
    `update_no`       VARCHAR(64)  DEFAULT NULL           COMMENT '更新人编号',
    `create_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`         TINYINT(1)   DEFAULT 0              COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_agent_id` (`agent_id`),
    KEY `idx_create_time` (`create_time`),
    KEY `idx_last_message_time` (`last_message_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话表';

-- ============================================================================
-- 23. 消息表 (chat_message)
-- ============================================================================
DROP TABLE IF EXISTS `chat_message`;
CREATE TABLE `chat_message` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `session_id`    BIGINT       NOT NULL               COMMENT '会话ID',
    `role`          VARCHAR(20)  NOT NULL               COMMENT '角色: USER/ASSISTANT/SYSTEM',
    `content`       TEXT         NOT NULL               COMMENT '消息内容',
    `thinking_chain` TEXT        DEFAULT NULL           COMMENT '思维链内容',
    `attachments`   JSON         DEFAULT NULL           COMMENT '附件列表JSON',
    `web_previews`  JSON         DEFAULT NULL           COMMENT '网页预览JSON',
    `used_skills`   JSON         DEFAULT NULL           COMMENT '使用的Skill列表JSON',
    `used_model`    VARCHAR(128) DEFAULT NULL           COMMENT '使用的模型',
    `token_usage`   INT          DEFAULT NULL           COMMENT 'Token消耗',
    `is_error`      TINYINT(1)   DEFAULT 0              COMMENT '是否错误消息',
    `num`           VARCHAR(64)  DEFAULT NULL           COMMENT '编号',
    `create_no`     VARCHAR(64)  DEFAULT NULL           COMMENT '创建人编号',
    `update_no`     VARCHAR(64)  DEFAULT NULL           COMMENT '更新人编号',
    `create_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`       TINYINT(1)   DEFAULT 0              COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_session_id` (`session_id`),
    KEY `idx_role` (`role`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息表';

-- ============================================================================
-- 24. 工作流表 (workflow)
-- ============================================================================
DROP TABLE IF EXISTS `workflow`;
CREATE TABLE `workflow` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `workflow_code` VARCHAR(64)  NOT NULL               COMMENT '工作流编码',
    `workflow_name` VARCHAR(128) NOT NULL               COMMENT '工作流名称',
    `description`   VARCHAR(1000) DEFAULT NULL          COMMENT '描述',
    `definition`    JSON         DEFAULT NULL           COMMENT '工作流定义JSON',
    `category`      VARCHAR(64)  DEFAULT NULL           COMMENT '分类',
    `status`        VARCHAR(20)  DEFAULT 'DRAFT'        COMMENT '状态: DRAFT/PUBLISHED/OFFLINE',
    `version`       VARCHAR(32)  DEFAULT 'V1.0.0'       COMMENT '版本号',
    `num`           VARCHAR(64)  DEFAULT NULL           COMMENT '编号',
    `create_no`     VARCHAR(64)  DEFAULT NULL           COMMENT '创建人编号',
    `update_no`     VARCHAR(64)  DEFAULT NULL           COMMENT '更新人编号',
    `create_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`       TINYINT(1)   DEFAULT 0              COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_workflow_code` (`workflow_code`),
    KEY `idx_status` (`status`),
    KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工作流表';

-- ============================================================================
-- 初始数据
-- ============================================================================

-- 初始化默认管理员账号 (密码: admin123, BCrypt加密)
INSERT INTO `user` (`username`, `password_hash`, `real_name`, `nickname`, `status`)
VALUES ('admin', '$2b$10$qO2ULEvkCZ5yYHl/kMnLzeCMdW4gNt53dkuzLnT5Ic1U8S77pkkhy', '系统管理员', 'Admin', 'ENABLED')
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`);

-- 初始化系统内置角色
INSERT INTO `role` (`role_code`, `role_name`, `description`, `is_system`, `is_enabled`) VALUES
('SUPER_ADMIN', '超级管理员', '拥有所有权限', 1, 1),
('ADMIN', '管理员', '管理端操作权限', 1, 1),
('USER', '普通用户', '用户端基础权限', 1, 1),
('READ_ONLY', '只读用户', '仅查看权限', 1, 1);

-- 初始化权限动作
INSERT INTO `permission_action` (`action_code`, `action_name`, `description`) VALUES
('read', '查看', '查看资源'),
('create', '创建', '创建新资源'),
('update', '更新', '修改资源'),
('delete', '删除', '删除资源'),
('admin', '管理', '管理资源(含权限分配)');

-- 初始化权限资源树
-- 管理端模块
INSERT INTO `permission_resource` (`resource_code`, `resource_name`, `resource_type`, `parent_id`, `sort_order`) VALUES
-- 一级菜单
('home', '首页仪表盘', 'MODULE', 0, 1),
('agent', 'Agent管理', 'MODULE', 0, 2),
('user_mgmt', '用户管理', 'MODULE', 0, 3),
('permission', '权限管理', 'MODULE', 0, 4),
('skill_store', 'Skill商店', 'MODULE', 0, 5),
('mcp_mgmt', 'MCP管理', 'MODULE', 0, 6),
('model_mgmt', '模型管理', 'MODULE', 0, 7),
('system_config', '系统配置', 'MODULE', 0, 8);

-- 获取已插入的资源ID作为二级菜单的parent_id (通过变量)
SET @home_id = (SELECT id FROM permission_resource WHERE resource_code = 'home' LIMIT 1);
SET @agent_id = (SELECT id FROM permission_resource WHERE resource_code = 'agent' LIMIT 1);
SET @user_mgmt_id = (SELECT id FROM permission_resource WHERE resource_code = 'user_mgmt' LIMIT 1);
SET @permission_id = (SELECT id FROM permission_resource WHERE resource_code = 'permission' LIMIT 1);
SET @skill_store_id = (SELECT id FROM permission_resource WHERE resource_code = 'skill_store' LIMIT 1);
SET @mcp_mgmt_id = (SELECT id FROM permission_resource WHERE resource_code = 'mcp_mgmt' LIMIT 1);
SET @model_mgmt_id = (SELECT id FROM permission_resource WHERE resource_code = 'model_mgmt' LIMIT 1);
SET @system_config_id = (SELECT id FROM permission_resource WHERE resource_code = 'system_config' LIMIT 1);

-- 二级菜单/按钮
INSERT INTO `permission_resource` (`resource_code`, `resource_name`, `resource_type`, `parent_id`, `sort_order`) VALUES
('agent:list', 'Agent列表', 'MENU', @agent_id, 1),
('agent:create', '创建Agent', 'BUTTON', @agent_id, 2),
('agent:update', '编辑Agent', 'BUTTON', @agent_id, 3),
('agent:delete', '删除Agent', 'BUTTON', @agent_id, 4),
('agent:publish', '发布Agent', 'BUTTON', @agent_id, 5),
('agent:online', '上线Agent', 'BUTTON', @agent_id, 6),
('agent:offline', '下线Agent', 'BUTTON', @agent_id, 7),
('user:list', '用户列表', 'MENU', @user_mgmt_id, 1),
('user:create', '创建用户', 'BUTTON', @user_mgmt_id, 2),
('user:update', '编辑用户', 'BUTTON', @user_mgmt_id, 3),
('user:delete', '删除用户', 'BUTTON', @user_mgmt_id, 4),
('user:enable', '启用用户', 'BUTTON', @user_mgmt_id, 5),
('user:disable', '禁用用户', 'BUTTON', @user_mgmt_id, 6),
('user:resign', '标记离职', 'BUTTON', @user_mgmt_id, 7),
('user:reset_password', '重置密码', 'BUTTON', @user_mgmt_id, 8),
('role:list', '角色列表', 'MENU', @permission_id, 1),
('role:create', '创建角色', 'BUTTON', @permission_id, 2),
('role:update', '编辑角色', 'BUTTON', @permission_id, 3),
('role:delete', '删除角色', 'BUTTON', @permission_id, 4),
('role:config_permission', '配置权限', 'BUTTON', @permission_id, 5),
('skill:list', 'Skill列表', 'MENU', @skill_store_id, 1),
('skill:install', '安装Skill', 'BUTTON', @skill_store_id, 2),
('skill:uninstall', '卸载Skill', 'BUTTON', @skill_store_id, 3),
('mcp:list', 'MCP列表', 'MENU', @mcp_mgmt_id, 1),
('mcp:create', '创建MCP', 'BUTTON', @mcp_mgmt_id, 2),
('mcp:update', '编辑MCP', 'BUTTON', @mcp_mgmt_id, 3),
('mcp:delete', '删除MCP', 'BUTTON', @mcp_mgmt_id, 4),
('mcp:test', '测试连通性', 'BUTTON', @mcp_mgmt_id, 5),
('model:list', '模型列表', 'MENU', @model_mgmt_id, 1),
('model:create', '注册模型', 'BUTTON', @model_mgmt_id, 2),
('model:update', '编辑模型', 'BUTTON', @model_mgmt_id, 3),
('model:delete', '删除模型', 'BUTTON', @model_mgmt_id, 4),
('model:test', '测试连通性', 'BUTTON', @model_mgmt_id, 5),
('config:view', '查看配置', 'BUTTON', @system_config_id, 1),
('config:update', '修改配置', 'BUTTON', @system_config_id, 2);

-- 给超级管理员分配所有权限 (read权限)
INSERT INTO `role_permission` (`role_id`, `resource_id`, `action_id`, `permission_code`, `grant_type`)
SELECT
    (SELECT id FROM role WHERE role_code = 'SUPER_ADMIN'),
    pr.id,
    pa.id,
    CONCAT(pr.resource_code, ':', pa.action_code),
    'ALLOW'
FROM permission_resource pr
CROSS JOIN permission_action pa;

-- 将admin用户关联到超级管理员角色
INSERT INTO `user_role` (`user_id`, `role_id`, `assign_type`, `assign_user`, `assign_time`)
SELECT u.id, r.id, 'DIRECT', 'system', NOW()
FROM user u, role r
WHERE u.username = 'admin' AND r.role_code = 'SUPER_ADMIN';

-- 初始化系统配置
INSERT INTO `system_config` (`config_key`, `config_value`, `config_type`, `description`, `is_public`, `is_modifiable`) VALUES
('max_agents', '100', 'NUMBER', '最大Agent数量', 0, 1),
('session_timeout', '120', 'NUMBER', '会话超时时间(分钟)', 0, 1),
('password_min_length', '6', 'NUMBER', '密码最小长度', 0, 1),
('login_max_fail_count', '5', 'NUMBER', '登录最大失败次数', 0, 1),
('account_lock_duration', '15', 'NUMBER', '账号锁定时长(分钟)', 0, 1),
('data_retention_days', '365', 'NUMBER', '数据保留天数', 0, 1),
('mfa_enabled', '0', 'BOOLEAN', '是否开启MFA', 0, 1),
('sso_enabled', '0', 'BOOLEAN', '是否开启SSO', 0, 1),
('platform_name', 'GAgentManager', 'STRING', '平台名称', 1, 1),
('platform_version', 'V5.5', 'STRING', '平台版本', 1, 0);

-- ============================================================================
-- 完成
-- ============================================================================
SELECT '数据库初始化完成！' AS message;
