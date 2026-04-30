package com.gagentmanager.infra.rbac.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.rbac.entity.PermissionActionEntity;
import org.apache.ibatis.annotations.Mapper;

/** 权限操作数据库 Mapper 接口 */
@Mapper
public interface PermissionActionMapper extends BaseMapper<PermissionActionEntity> {}
