package com.gagentmanager.infra.audit.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.audit.AuditLog;
import com.gagentmanager.domain.audit.AuditLogRepository;
import com.gagentmanager.infra.audit.entity.AuditLogEntity;
import com.gagentmanager.infra.audit.mapper.AuditLogMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

/** 审计日志仓储实现 */
@Repository
public class AuditLogRepositoryImpl implements AuditLogRepository {

    private final AuditLogMapper mapper;

    public AuditLogRepositoryImpl(AuditLogMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public IPage<AuditLog> list(IPage<AuditLog> page, Long operatorId, String resourceType, String action, String startTime, String endTime) {
        Page<AuditLogEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<AuditLogEntity> qw = new LambdaQueryWrapper<AuditLogEntity>();
        if (operatorId != null) qw.eq(AuditLogEntity::getOperatorId, operatorId);
        if (StringUtils.hasText(resourceType)) qw.eq(AuditLogEntity::getResourceType, resourceType);
        if (StringUtils.hasText(action)) qw.eq(AuditLogEntity::getAction, action);
        qw.orderByDesc(AuditLogEntity::getCreateTime);
        IPage<AuditLogEntity> result = mapper.selectPage(mpPage, qw);
        return convertPage(result);
    }

    @Override
    public void save(AuditLog log) {
        AuditLogEntity e = new AuditLogEntity();
        BeanUtils.copyProperties(log, e);
        mapper.insert(e);
    }

    private IPage<AuditLog> convertPage(IPage<AuditLogEntity> source) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<AuditLog> target =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(source.getCurrent(), source.getSize(), source.getTotal());
        target.setRecords(source.getRecords().stream().map(this::toDomain).toList());
        return target;
    }

    private AuditLog toDomain(AuditLogEntity e) {
        AuditLog d = new AuditLog();
        BeanUtils.copyProperties(e, d);
        return d;
    }
}
