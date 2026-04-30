package com.gagentmanager.infra.system_config.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.system_config.entity.SystemConfigEntity;
import org.apache.ibatis.annotations.Mapper;

/** 系统配置数据库 Mapper 接口 */
@Mapper
public interface SystemConfigMapper extends BaseMapper<SystemConfigEntity> {}
