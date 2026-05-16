package com.gagentmanager.domain.audit;

import com.baomidou.mybatisplus.core.metadata.IPage;

/** 审计日志仓储接口，支持按操作者、资源类型、动作和时间范围分页查询 */
public interface AuditLogRepository {
    IPage<AuditLog> list(IPage<AuditLog> page, Long operatorId, String resourceType, String action, String startTime, String endTime);
    void save(AuditLog log);
}
