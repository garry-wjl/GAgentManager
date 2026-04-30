package com.gagentmanager.infra.rbac.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.rbac.entity.RoleEntity;
import org.apache.ibatis.annotations.Mapper;

/** 角色数据库 Mapper 接口 */
@Mapper
public interface RoleMapper extends BaseMapper<RoleEntity> {}
