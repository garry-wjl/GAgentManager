package com.gagentmanager.infra.home.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Date;

/** 公告数据库实体，映射 notice 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("notice")
public class NoticeEntity extends DomainEntity {
    private String title;
    private String content;
    private String type;
    private String severity;
    private String sender;
    private String targetUsers;
    private String link;
    private Date expireTime;
}
