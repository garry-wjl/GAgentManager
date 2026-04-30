package com.gagentmanager.infra.audit.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Date;

/** 审计日志数据库实体，映射 audit_log 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("audit_log")
public class AuditLogEntity extends DomainEntity {
    private Long operatorId;
    private String operatorName;
    private String resourceType;
    private Long resourceId;
    private String action;
    private String detail;
    private String ipAddress;
    private String userAgent;
    private String result;
    private String errorMsg;
}
