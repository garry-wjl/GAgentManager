package com.gagentmanager.domain.audit;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import java.util.Date;

/** 审计日志实体，记录操作者、资源类型、动作和结果 */
@Data
public class AuditLog extends DomainEntity {
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

    public static AuditLog create(Long operatorId, String operatorName, String resourceType,
                                  Long resourceId, String action, String detail,
                                  String ipAddress, String userAgent, String result, String errorMsg) {
        AuditLog log = new AuditLog();
        log.operatorId = operatorId;
        log.operatorName = operatorName;
        log.resourceType = resourceType;
        log.resourceId = resourceId;
        log.action = action;
        log.detail = detail;
        log.ipAddress = ipAddress;
        log.userAgent = userAgent;
        log.result = result;
        log.errorMsg = errorMsg;
        log.setCreateTime(new Date());
        return log;
    }
}
