package com.gagentmanager.domain.agent;

import java.util.List;

/** Agent 版本仓储接口 */
public interface AgentVersionRepository {
    AgentVersion findById(Long id);
    AgentVersion findByNum(String num);
    List<AgentVersion> findByAgentId(Long agentId);
    AgentVersion findByAgentIdAndVersion(Long agentId, String version);
    void save(AgentVersion version, Long operatorId);
    void markCurrent(Long agentId, String version, Long operatorId);
}
