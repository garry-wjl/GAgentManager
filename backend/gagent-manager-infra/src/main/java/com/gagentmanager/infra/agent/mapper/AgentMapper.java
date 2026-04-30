package com.gagentmanager.infra.agent.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.agent.entity.AgentEntity;
import org.apache.ibatis.annotations.Mapper;

/** Agent 数据库 Mapper 接口 */
@Mapper
public interface AgentMapper extends BaseMapper<AgentEntity> {
}
