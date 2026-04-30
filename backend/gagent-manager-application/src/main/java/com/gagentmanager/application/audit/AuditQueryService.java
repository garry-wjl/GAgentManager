package com.gagentmanager.application.audit;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.audit.AuditLogVO;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.domain.audit.AuditLog;
import com.gagentmanager.domain.audit.AuditLogRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

/** 审计日志查询服务，提供多条件分页查询和 VO 转换 */
@Service
public class AuditQueryService {

    private final AuditLogRepository auditLogRepository;

    public AuditQueryService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public IPage<AuditLogVO> listAuditLogs(PageParam pageParam, Long operatorId, String resourceType, String action, String startTime, String endTime) {
        Page<AuditLog> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<AuditLog> logPage = auditLogRepository.list(page, operatorId, resourceType, action, startTime, endTime);
        return logPage.convert(this::toVO);
    }

    private AuditLogVO toVO(AuditLog log) {
        AuditLogVO vo = new AuditLogVO();
        BeanUtils.copyProperties(log, vo);
        return vo;
    }
}
