package com.gagentmanager.client.audit;

import lombok.Data;

import java.util.Date;

/** 审计日志视图对象，包含操作者、操作详情、IP 和结果信息 */
@Data
public class AuditLogVO {
    private String num;
    private String operatorName;
    private String resourceType;
    private Long resourceId;
    private String action;
    private String detail;
    private String ipAddress;
    private String userAgent;
    private String result;
    private String errorMsg;
    private Date createTime;
}
