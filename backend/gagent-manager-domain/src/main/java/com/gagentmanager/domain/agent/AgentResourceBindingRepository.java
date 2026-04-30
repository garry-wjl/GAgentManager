package com.gagentmanager.domain.agent;

import java.util.List;

/** Agent 资源绑定仓储接口 */
public interface AgentResourceBindingRepository {
    AgentResourceBinding findById(Long id);
    AgentResourceBinding findByNum(String num);
    List<AgentResourceBinding> findByAgentId(Long agentId);
    List<AgentResourceBinding> findByAgentIdAndType(Long agentId, String resourceType);
    void save(AgentResourceBinding binding, Long operatorId);
    void delete(String num, Long operatorId);
    long countByResourceId(Long resourceId);
}
