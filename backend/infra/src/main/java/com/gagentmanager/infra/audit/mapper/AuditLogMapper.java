package com.gagentmanager.infra.audit.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.audit.entity.AuditLogEntity;
import org.apache.ibatis.annotations.Mapper;

/** 审计日志数据库 Mapper 接口 */
@Mapper
public interface AuditLogMapper extends BaseMapper<AuditLogEntity> {}
