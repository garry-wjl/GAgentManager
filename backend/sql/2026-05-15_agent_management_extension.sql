-- ============================================================================
-- Agent 管理扩展 DDL - 2026-05-15
-- 关联 PRD: doc/产品方案/2026-05-15_Agent管理-PRD.md
-- ============================================================================

-- 1. agent 表新增 user_prompt 和 opt_lock（乐观锁）字段
ALTER TABLE `agent`
    ADD COLUMN `user_prompt` TEXT DEFAULT NULL COMMENT '用户提示词（预设输入模板）' AFTER `system_prompt`,
    ADD COLUMN `opt_lock` BIGINT NOT NULL DEFAULT 0 COMMENT '乐观锁版本号' AFTER `retry_count`;

-- 2. agent_resource_binding 表新增 is_enabled 字段
ALTER TABLE `agent_resource_binding`
    ADD COLUMN `is_enabled` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Agent 级启停开关' AFTER `sort_order`;

-- 3. 历史数据初始化
UPDATE `agent_resource_binding` SET `is_enabled` = 1 WHERE `is_enabled` IS NULL;
