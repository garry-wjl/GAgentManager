package com.gagentmanager.application.agent;

import com.gagentmanager.client.agent.*;
import com.gagentmanager.domain.agent.*;
import com.gagentmanager.domain.model.Model;
import com.gagentmanager.domain.model.ModelRepository;
import com.gagentmanager.domain.skill.Skill;
import com.gagentmanager.domain.skill.SkillRepository;
import com.gagentmanager.domain.workflow.Workflow;
import com.gagentmanager.domain.workflow.WorkflowRepository;
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
    private final ModelRepository modelRepository;
    private final WorkflowRepository workflowRepository;
    private final SkillRepository skillRepository;

    public AgentCommandService(AgentRepository agentRepository, AgentVersionRepository agentVersionRepository, AgentResourceBindingRepository bindingRepository, ModelRepository modelRepository, WorkflowRepository workflowRepository, SkillRepository skillRepository) {
        this.agentRepository = agentRepository;
        this.agentVersionRepository = agentVersionRepository;
        this.bindingRepository = bindingRepository;
        this.modelRepository = modelRepository;
        this.workflowRepository = workflowRepository;
        this.skillRepository = skillRepository;
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
        // 发布前必须绑定模型
        List<AgentResourceBinding> modelBindings = bindingRepository.findByAgentIdAndType(agent.getId(), "MODEL");
        if (modelBindings.isEmpty()) {
            throw new BusinessException(ErrorCode.AGENT_MODEL_NOT_BOUND);
        }
        String newVersion = agent.getVersion() != null ? bumpVersion(agent.getVersion()) : "1.0.0";
        agent.publish(newVersion, operatorId);
        agentRepository.save(agent, operatorId);

        // 序列化当前资源绑定快照到 configSnapshot
        List<AgentResourceBinding> allBindings = bindingRepository.findByAgentId(agent.getId());
        String configSnapshot = serializeBindings(allBindings);

        AgentVersion version = AgentVersion.create(agent.getId(), newVersion, agent.getSystemPrompt(), String.valueOf(operatorId));
        version.setChangelog(param.getChangelog());
        version.setConfigSnapshot(configSnapshot);
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

    // ========== 新增：模型/工作流/Skill 绑定方法 ==========

    /** 绑定模型（resourceType=MODEL，单 Agent 仅允许绑定一个） */
    public void bindModel(String agentNum, BindModelParam param, Long operatorId) {
        Agent agent = agentRepository.findByNum(agentNum);
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        // 校验 MODEL 唯一
        List<AgentResourceBinding> modelBindings = bindingRepository.findByAgentIdAndType(agent.getId(), "MODEL");
        if (!modelBindings.isEmpty()) {
            throw new BusinessException(ErrorCode.AGENT_MODEL_ALREADY_BOUND);
        }
        // 跨域校验模型已启用
        Model model = modelRepository.findById(param.getModelId());
        if (model == null) {
            throw new BusinessException(ErrorCode.MODEL_NOT_FOUND);
        }
        if (!"ENABLED".equals(model.getStatus())) {
            throw new BusinessException(ErrorCode.MCP_DISABLED);
        }
        AgentResourceBinding binding = AgentResourceBinding.create(
                agent.getId(), "MODEL", param.getModelId(), true, 0, null);
        bindingRepository.save(binding, operatorId);
    }

    /** 绑定工作流（resourceType=WORKFLOW，需校验工作流已发布） */
    public void bindWorkflow(String agentNum, BindResourceParamV2 param, Long operatorId) {
        Agent agent = agentRepository.findByNum(agentNum);
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        Workflow workflow = workflowRepository.findById(param.getResourceId());
        if (workflow == null) {
            throw new BusinessException(ErrorCode.WORKFLOW_NOT_FOUND);
        }
        if (!"PUBLISHED".equals(workflow.getStatus())) {
            throw new BusinessException(ErrorCode.WORKFLOW_NOT_PUBLISHED);
        }
        AgentResourceBinding binding = AgentResourceBinding.create(
                agent.getId(), "WORKFLOW", param.getResourceId(), false,
                param.getSortOrder() != null ? param.getSortOrder() : 0, null);
        bindingRepository.save(binding, operatorId);
    }

    /** 解绑工作流 */
    public void unbindWorkflow(String bindingNum, Long operatorId) {
        unbindResource(bindingNum, operatorId);
    }

    /** 启停工作流 */
    public void toggleWorkflow(String bindingNum, Long operatorId) {
        AgentResourceBinding binding = bindingRepository.findByNum(bindingNum);
        if (binding == null) {
            throw new BusinessException(ErrorCode.RESOURCE_BINDING_NOT_FOUND);
        }
        if (!"WORKFLOW".equals(binding.getResourceType())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST);
        }
        binding.toggleEnabled(operatorId);
        bindingRepository.save(binding, operatorId);
    }

    /** 绑定 Skill（resourceType=SKILL，需校验 Skill 已安装） */
    public void bindSkill(String agentNum, BindResourceParamV2 param, Long operatorId) {
        Agent agent = agentRepository.findByNum(agentNum);
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        Skill skill = skillRepository.findById(param.getResourceId());
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        if (!"INSTALLED".equals(skill.getStatus())) {
            throw new BusinessException(ErrorCode.SKILL_NOT_INSTALLED);
        }
        AgentResourceBinding binding = AgentResourceBinding.create(
                agent.getId(), "SKILL", param.getResourceId(), false,
                param.getSortOrder() != null ? param.getSortOrder() : 0, null);
        bindingRepository.save(binding, operatorId);
    }

    /** 解绑 Skill */
    public void unbindSkill(String bindingNum, Long operatorId) {
        unbindResource(bindingNum, operatorId);
    }

    /** 批量更新资源绑定排序 */
    public void updateBindingSort(UpdateBindingSortParam param, Long operatorId) {
        for (UpdateBindingSortParam.BindingSortItem item : param.getBindings()) {
            AgentResourceBinding binding = bindingRepository.findByNum(item.getBindingNum());
            if (binding == null) {
                throw new BusinessException(ErrorCode.RESOURCE_BINDING_NOT_FOUND);
            }
            binding.updateSort(item.getSortOrder(), operatorId);
            bindingRepository.save(binding, operatorId);
        }
    }

    // ========== Private methods ==========

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

    /** 序列化绑定列表为 JSON 字符串，用于版本快照 */
    private String serializeBindings(List<AgentResourceBinding> bindings) {
        if (bindings == null || bindings.isEmpty()) {
            return null;
        }
        return bindings.stream()
                .map(b -> String.format("{\"type\":\"%s\",\"id\":%d,\"name\":\"%s\",\"enabled\":%s,\"sort\":%d}",
                        b.getResourceType(), b.getResourceId(), b.getNum(), b.getIsEnabled(), b.getSortOrder()))
                .collect(Collectors.joining(",", "[", "]"));
    }
}
