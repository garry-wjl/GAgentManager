package com.gagentmanager.application.agent;

import com.gagentmanager.client.agent.*;
import com.gagentmanager.domain.agent.*;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/** Agent 写操作服务，负责创建/更新/删除/发布/启停/回滚/资源绑定等命令处理 */
@Service
public class AgentCommandService {

    private final AgentRepository agentRepository;
    private final AgentVersionRepository agentVersionRepository;
    private final AgentResourceBindingRepository bindingRepository;

    public AgentCommandService(AgentRepository agentRepository, AgentVersionRepository agentVersionRepository, AgentResourceBindingRepository bindingRepository) {
        this.agentRepository = agentRepository;
        this.agentVersionRepository = agentVersionRepository;
        this.bindingRepository = bindingRepository;
    }

    public AgentVO createAgent(CreateAgentParam param, Long operatorId) {
        Agent existing = agentRepository.findByCode(param.getAgentCode());
        if (existing != null) {
            throw new BusinessException(ErrorCode.AGENT_CODE_ALREADY_EXISTS);
        }
        Agent agent = new Agent();
        BeanUtils.copyProperties(param, agent);
        agent.save(operatorId);
        agentRepository.save(agent, operatorId);
        return toVO(agent);
    }

    public void updateAgent(UpdateAgentParam param, Long operatorId) {
        Agent agent = agentRepository.findById(param.getId());
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        BeanUtils.copyProperties(param, agent, "id", "agentCode", "agentType");
        agent.setUpdateNo(String.valueOf(operatorId));
        agentRepository.save(agent, operatorId);
    }

    public void deleteAgent(String num, Long operatorId) {
        Agent agent = agentRepository.findByNum(num);
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        agent.delete(operatorId);
        agentRepository.delete(num, operatorId);
    }

    public void publishAgent(String num, PublishAgentParam param, Long operatorId) {
        Agent agent = agentRepository.findByNum(num);
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        String newVersion = agent.getVersion() != null ? bumpVersion(agent.getVersion()) : "1.0.0";
        agent.publish(newVersion, operatorId);
        agentRepository.save(agent, operatorId);

        AgentVersion version = AgentVersion.create(agent.getId(), newVersion, agent.getSystemPrompt(), String.valueOf(operatorId));
        version.setChangelog(param.getChangelog());
        version.publish();
        agentVersionRepository.save(version, operatorId);
    }

    public void deployAgent(String num, Long operatorId) {
        Agent agent = agentRepository.findByNum(num);
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        agent.deploy(operatorId);
        agentRepository.save(agent, operatorId);
    }

    public void startAgent(String num, Long operatorId) {
        Agent agent = agentRepository.findByNum(num);
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        agent.start(operatorId);
        agentRepository.save(agent, operatorId);
    }

    public void stopAgent(String num, Long operatorId) {
        Agent agent = agentRepository.findByNum(num);
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        agent.stop(operatorId);
        agentRepository.save(agent, operatorId);
    }

    public void rollbackAgent(String num, String targetVersion, Long operatorId) {
        Agent agent = agentRepository.findByNum(num);
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        agent.rollback(targetVersion, operatorId);
        agentRepository.save(agent, operatorId);
    }

    public void bindResource(String agentNum, BindResourceParam param, Long operatorId) {
        Agent agent = agentRepository.findByNum(agentNum);
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        AgentResourceBinding binding = AgentResourceBinding.create(
                agent.getId(), param.getResourceType(), param.getResourceId(),
                param.getIsDefault(), param.getSortOrder(), param.getConfig());
        bindingRepository.save(binding, operatorId);
    }

    public void unbindResource(String bindingNum, Long operatorId) {
        AgentResourceBinding binding = bindingRepository.findByNum(bindingNum);
        if (binding == null) {
            throw new BusinessException(ErrorCode.RESOURCE_BINDING_NOT_FOUND);
        }
        bindingRepository.delete(bindingNum, operatorId);
    }

    private String bumpVersion(String version) {
        String[] parts = version.split("\\.");
        int patch = Integer.parseInt(parts[2]) + 1;
        return parts[0] + "." + parts[1] + "." + patch;
    }

    private AgentVO toVO(Agent a) {
        AgentVO vo = new AgentVO();
        BeanUtils.copyProperties(a, vo);
        return vo;
    }
}
