package com.gagentmanager.client.user;

import lombok.Data;

import java.util.Date;

/** 用户操作日志视图对象，包含操作类型、目标、IP 和状态 */
@Data
public class UserOperationLogVO {
    private String num;
    private String operationType;
    private String operatorName;
    private String targetName;
    private String detail;
    private String ipAddress;
    private String status;
    private Date createTime;
}
