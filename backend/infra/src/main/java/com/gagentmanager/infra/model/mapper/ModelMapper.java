package com.gagentmanager.infra.model.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.model.entity.ModelEntity;
import org.apache.ibatis.annotations.Mapper;

/** 模型数据库 Mapper 接口 */
@Mapper
public interface ModelMapper extends BaseMapper<ModelEntity> {
}
