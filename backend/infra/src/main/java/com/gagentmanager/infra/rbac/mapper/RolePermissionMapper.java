package com.gagentmanager.infra.rbac.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.rbac.entity.RolePermissionEntity;
import org.apache.ibatis.annotations.Mapper;

/** 角色-权限关联数据库 Mapper 接口 */
@Mapper
public interface RolePermissionMapper extends BaseMapper<RolePermissionEntity> {}
