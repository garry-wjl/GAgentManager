package com.gagentmanager.infra.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/** 对话分享数据库实体，映射 chat_share 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("chat_share")
public class ChatShareEntity extends DomainEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String shareToken;
    private Long sessionId;
    private Long userId;
    private Date expireTime;
    private Boolean isExpired;
    private Integer viewCount;
}
