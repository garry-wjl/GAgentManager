package com.gagentmanager.infra.agent.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.agent.entity.AgentResourceBindingEntity;
import org.apache.ibatis.annotations.Mapper;

/** Agent 资源绑定数据库 Mapper 接口 */
@Mapper
public interface AgentResourceBindingMapper extends BaseMapper<AgentResourceBindingEntity> {
}
