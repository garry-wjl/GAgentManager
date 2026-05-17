-- ============================================================================
-- MCP 管理重构：基础信息 + MCP配置 + 工具列表
-- 新增：source, icon, tags, feature, config_json, request_headers
-- 删除：mcp_code, latest_version, current_version, server_url, protocol_version,
--       transport_type, auth_type, timeout_seconds, retry_enabled, max_retries,
--       health_check_url, health_check_interval, env_variables, command, args, error_count
-- ============================================================================

-- 1. 新增字段
ALTER TABLE `mcp_service`
    ADD COLUMN `source` VARCHAR(20) DEFAULT 'MANUAL' COMMENT '来源: MCP_GATEWAY/MANUAL' AFTER `bound_agent_count`,
    ADD COLUMN `icon` VARCHAR(512) DEFAULT NULL COMMENT '图标URL' AFTER `status`,
    ADD COLUMN `tags` VARCHAR(1000) DEFAULT NULL COMMENT '标签(逗号分隔)' AFTER `icon`,
    ADD COLUMN `feature` TEXT DEFAULT NULL COMMENT '功能介绍' AFTER `tags`,
    ADD COLUMN `config_json` TEXT DEFAULT NULL COMMENT 'MCP配置JSON' AFTER `feature`,
    ADD COLUMN `request_headers` TEXT DEFAULT NULL COMMENT '请求头JSON数组' AFTER `config_json`;

-- 2. 迁移旧字段数据到新字段
UPDATE `mcp_service` SET
    `config_json` = JSON_OBJECT(
        'type', IFNULL(`transport_type`, 'SSE'),
        'url', IFNULL(`server_url`, ''),
        'protocolVersion', IFNULL(`protocol_version`, ''),
        'authType', IFNULL(`auth_type`, ''),
        'timeoutSeconds', IFNULL(`timeout_seconds`, 30),
        'retryEnabled', IFNULL(`retry_enabled`, 1),
        'maxRetries', IFNULL(`max_retries`, 3),
        'healthCheckUrl', IFNULL(`health_check_url`, ''),
        'healthCheckInterval', IFNULL(`health_check_interval`, 60),
        'envVariables', `env_variables`,
        'command', `command`,
        'args', `args`
    ),
    `status` = CASE WHEN `is_enabled` = 1 THEN 'ENABLED' ELSE 'DISABLED' END,
    `source` = 'MANUAL'
WHERE `deleted` = 0;

-- 3. 删除旧索引
ALTER TABLE `mcp_service` DROP INDEX `uk_mcp_code`;

-- 4. 删除旧字段
ALTER TABLE `mcp_service`
    DROP COLUMN `mcp_code`,
    DROP COLUMN `latest_version`,
    DROP COLUMN `current_version`,
    DROP COLUMN `server_url`,
    DROP COLUMN `protocol_version`,
    DROP COLUMN `transport_type`,
    DROP COLUMN `auth_type`,
    DROP COLUMN `timeout_seconds`,
    DROP COLUMN `retry_enabled`,
    DROP COLUMN `max_retries`,
    DROP COLUMN `health_check_url`,
    DROP COLUMN `health_check_interval`,
    DROP COLUMN `env_variables`,
    DROP COLUMN `command`,
    DROP COLUMN `args`,
    DROP COLUMN `last_connect_time`,
    DROP COLUMN `error_count`;
