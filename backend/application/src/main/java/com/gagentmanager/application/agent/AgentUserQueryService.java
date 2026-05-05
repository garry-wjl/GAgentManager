package com.gagentmanager.application.agent;

import com.gagentmanager.client.agent.AgentSimpleVO;
import com.gagentmanager.domain.agent.Agent;
import com.gagentmanager.domain.agent.AgentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/** 用户端 Agent 查询服务 */
@Service
public class AgentUserQueryService {

    private final AgentRepository agentRepository;

    public AgentUserQueryService(AgentRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    public List<AgentSimpleVO> listAgentsForUser(Long userId) {
        List<Agent> agents = agentRepository.listForUser(userId);
        return agents.stream().map(this::toSimpleVO).collect(Collectors.toList());
    }

    public AgentSimpleVO selectAutoAgent(Long userId, String content) {
        Agent agent = agentRepository.selectAutoAgent(content);
        if (agent == null) {
            return null;
        }
        return toSimpleVO(agent);
    }

    private AgentSimpleVO toSimpleVO(Agent a) {
        AgentSimpleVO vo = new AgentSimpleVO();
        vo.setId(a.getId());
        vo.setNum(a.getNum());
        vo.setAgentName(a.getAgentName());
        vo.setDescription(a.getDescription());
        vo.setAgentType(a.getAgentType());
        vo.setIconUrl(a.getIconUrl());
        vo.setStatus(a.getStatus());
        return vo;
    }
}
