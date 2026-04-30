package com.gagentmanager.infra.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** 对话消息数据库实体，映射 chat_message 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("chat_message")
public class ChatMessageEntity extends DomainEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long sessionId;
    private String role;
    private String content;
    private String thinkingChain;
    private String attachments;
    private String webPreviews;
    private String usedSkills;
    private String usedModel;
    private Integer tokenUsage;
    private Boolean isError;
}
