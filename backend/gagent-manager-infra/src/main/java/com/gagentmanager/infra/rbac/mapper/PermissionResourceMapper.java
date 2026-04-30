package com.gagentmanager.infra.rbac.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.rbac.entity.PermissionResourceEntity;
import org.apache.ibatis.annotations.Mapper;

/** 权限资源数据库 Mapper 接口 */
@Mapper
public interface PermissionResourceMapper extends BaseMapper<PermissionResourceEntity> {}
