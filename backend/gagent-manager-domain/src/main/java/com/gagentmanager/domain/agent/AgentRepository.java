package com.gagentmanager.domain.agent;

import com.baomidou.mybatisplus.core.metadata.IPage;

/** Agent 仓储接口，定义 Agent 实体的持久化操作 */
public interface AgentRepository {
    Agent findById(Long id);
    Agent findByNum(String num);
    Agent findByCode(String code);
    IPage<Agent> list(IPage<Agent> page, String keyword, String status, String agentType);
    void save(Agent agent, Long operatorId);
    void delete(String num, Long operatorId);
    IPage<Agent> listByStatus(IPage<Agent> page, String status);
    long count();
    long countOnline();
}
