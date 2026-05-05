package com.gagentmanager.infra.agent.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.agent.entity.AgentVersionEntity;
import org.apache.ibatis.annotations.Mapper;

/** Agent 版本数据库 Mapper 接口 */
@Mapper
public interface AgentVersionMapper extends BaseMapper<AgentVersionEntity> {
}
