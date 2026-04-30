package com.gagentmanager.infra.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/** 对话会话数据库实体，映射 chat_session 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("chat_session")
public class ChatSessionEntity extends DomainEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private Long agentId;
    private String sessionTitle;
    private Integer messageCount;
    private Date lastMessageTime;
}
