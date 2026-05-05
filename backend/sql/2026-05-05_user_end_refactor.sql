-- ============================================================================
-- 用户端重构 DDL
-- 分支: feature-20260505-user-end-refactor
-- ============================================================================

USE `gagent_manager`;

-- 1. 对话分享表 (chat_share)
DROP TABLE IF EXISTS `chat_share`;
CREATE TABLE `chat_share` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `share_token`   VARCHAR(64)  NOT NULL                COMMENT '唯一分享Token',
    `session_id`    BIGINT       NOT NULL                COMMENT '关联会话ID',
    `user_id`       BIGINT       NOT NULL                COMMENT '创建者用户ID',
    `expire_time`   DATETIME(3)  NOT NULL                COMMENT '过期时间',
    `is_expired`    TINYINT(1)   DEFAULT 0               COMMENT '是否已过期',
    `view_count`    INT          DEFAULT 0               COMMENT '浏览次数',
    `num`           VARCHAR(64)  DEFAULT NULL            COMMENT '编号',
    `create_no`     VARCHAR(64)  DEFAULT NULL            COMMENT '创建人编号',
    `update_no`     VARCHAR(64)  DEFAULT NULL            COMMENT '更新人编号',
    `create_time`   DATETIME(3)  DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `update_time`   DATETIME(3)  DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    `deleted`       TINYINT(1)   DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_share_token` (`share_token`),
    KEY `idx_session_id` (`session_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='对话分享表';

-- 2. 文件附件表 (file_attachment)
DROP TABLE IF EXISTS `file_attachment`;
CREATE TABLE `file_attachment` (
    `id`          BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `session_id`  BIGINT        NOT NULL                COMMENT '所属会话ID',
    `user_id`     BIGINT        NOT NULL                COMMENT '上传者ID',
    `file_key`    VARCHAR(256)  NOT NULL                COMMENT '对象存储Key',
    `file_url`    VARCHAR(512)  NOT NULL                COMMENT '文件访问URL',
    `file_name`   VARCHAR(256)  NOT NULL                COMMENT '原始文件名',
    `file_size`   BIGINT        NOT NULL                COMMENT '文件大小(字节)',
    `mime_type`   VARCHAR(128)  NOT NULL                COMMENT 'MIME类型',
    `file_type`   VARCHAR(32)   NOT NULL                COMMENT '文件分类: IMAGE/TEXT/PDF/OFFICE',
    `num`         VARCHAR(64)   DEFAULT NULL            COMMENT '编号',
    `create_no`   VARCHAR(64)   DEFAULT NULL            COMMENT '创建人编号',
    `update_no`   VARCHAR(64)   DEFAULT NULL            COMMENT '更新人编号',
    `create_time` DATETIME(3)   DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `update_time` DATETIME(3)   DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    `deleted`     TINYINT(1)    DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_file_key` (`file_key`),
    KEY `idx_session_id` (`session_id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文件附件表';

-- 3. Prompt 模板表 (prompt_template)
DROP TABLE IF EXISTS `prompt_template`;
CREATE TABLE `prompt_template` (
    `id`          BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title`       VARCHAR(128)  NOT NULL                COMMENT 'Prompt标题',
    `content`     TEXT          NOT NULL                COMMENT 'Prompt内容',
    `category`    VARCHAR(32)   NOT NULL                COMMENT '分类: CODE/DATA/DOC/BUG/TRANSLATE/BRAINSTORM',
    `icon`        VARCHAR(16)   NOT NULL                COMMENT '图标Emoji',
    `sort_order`  INT           DEFAULT 0               COMMENT '排序',
    `is_enabled`  TINYINT(1)    DEFAULT 1               COMMENT '是否启用',
    `num`         VARCHAR(64)   DEFAULT NULL            COMMENT '编号',
    `create_no`   VARCHAR(64)   DEFAULT NULL            COMMENT '创建人编号',
    `update_no`   VARCHAR(64)   DEFAULT NULL            COMMENT '更新人编号',
    `create_time` DATETIME(3)   DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `update_time` DATETIME(3)   DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    `deleted`     TINYINT(1)    DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_is_enabled` (`is_enabled`),
    KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Prompt模板表';

-- 4. 登录设备表 (user_device)
DROP TABLE IF EXISTS `user_device`;
CREATE TABLE `user_device` (
    `id`               BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id`          BIGINT        NOT NULL                COMMENT '用户ID',
    `device_token`     VARCHAR(256)  NOT NULL                COMMENT '登录Token',
    `device_name`      VARCHAR(128)  NOT NULL                COMMENT '设备名称',
    `ip_address`       VARCHAR(64)   NOT NULL                COMMENT '登录IP',
    `user_agent`       VARCHAR(512)  NOT NULL                COMMENT 'User-Agent',
    `login_time`       DATETIME(3)   NOT NULL                COMMENT '登录时间',
    `last_active_time` DATETIME(3)   NOT NULL                COMMENT '最后活跃时间',
    `is_online`        TINYINT(1)    DEFAULT 1               COMMENT '是否在线',
    `num`              VARCHAR(64)   DEFAULT NULL            COMMENT '编号',
    `create_no`        VARCHAR(64)   DEFAULT NULL            COMMENT '创建人编号',
    `update_no`        VARCHAR(64)   DEFAULT NULL            COMMENT '更新人编号',
    `create_time`      DATETIME(3)   DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `update_time`      DATETIME(3)   DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    `deleted`          TINYINT(1)    DEFAULT 0               COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_device_token` (`device_token`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_is_online` (`is_online`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录设备表';

-- 5. 消息表增加引用字段 (chat_message)
ALTER TABLE `chat_message` ADD COLUMN `reply_to_message_id` BIGINT DEFAULT NULL COMMENT '被引用消息ID' AFTER `content`;
ALTER TABLE `chat_message` ADD INDEX `idx_reply_to_message_id` (`reply_to_message_id`);

-- 6. user 表增加 last_login_time 索引
ALTER TABLE `user` ADD INDEX `idx_last_login_time` (`last_login_time`);

-- ============================================================================
-- 初始数据
-- ============================================================================

-- 初始化 Prompt 模板数据
INSERT INTO `prompt_template` (`title`, `content`, `category`, `icon`, `sort_order`, `is_enabled`) VALUES
('写代码', '请帮我写一段实现快速排序的 Python 代码，要求包含注释', 'CODE', '💬', 1, 1),
('数据分析', '请帮我分析下面这份 CSV 数据，给出统计摘要和可视化建议', 'DATA', '📊', 2, 1),
('写文档', '请帮我写一份项目技术方案文档，包含架构设计和技术选型', 'DOC', '📝', 3, 1),
('Bug 排查', '我遇到了一个 Bug，错误信息如下：\n\n```\n...\n```\n\n请帮我分析原因', 'BUG', '🔍', 4, 1),
('翻译', '请将以下英文内容翻译为中文：\n\n...', 'TRANSLATE', '🌐', 5, 1),
('头脑风暴', '请帮我 brainstorm 一个 AI 产品的 10 个核心功能点', 'BRAINSTORM', '💡', 6, 1);
