package com.gagentmanager.application.agent;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.agent.AgentResourceBindingVO;
import com.gagentmanager.client.agent.AgentVO;
import com.gagentmanager.client.agent.AgentVersionVO;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.model.ModelVO;
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

import java.util.List;
import java.util.stream.Collectors;

/** Agent 查询服务，提供 Agent 列表/详情/版本历史/资源绑定查询 */
@Service
public class AgentQueryService {

    private final AgentRepository agentRepository;
    private final AgentVersionRepository agentVersionRepository;
    private final AgentResourceBindingRepository bindingRepository;
    private final ModelRepository modelRepository;
    private final WorkflowRepository workflowRepository;
    private final SkillRepository skillRepository;

    public AgentQueryService(AgentRepository agentRepository, AgentVersionRepository agentVersionRepository, AgentResourceBindingRepository bindingRepository, ModelRepository modelRepository, WorkflowRepository workflowRepository, SkillRepository skillRepository) {
        this.agentRepository = agentRepository;
        this.agentVersionRepository = agentVersionRepository;
        this.bindingRepository = bindingRepository;
        this.modelRepository = modelRepository;
        this.workflowRepository = workflowRepository;
        this.skillRepository = skillRepository;
    }

    public AgentVO getAgentById(Long id) {
        Agent agent = agentRepository.findById(id);
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        return toAgentVO(agent);
    }

    public AgentVO getAgentByNum(String num) {
        Agent agent = agentRepository.findByNum(num);
        if (agent == null) {
            throw new BusinessException(ErrorCode.AGENT_NOT_FOUND);
        }
        return toAgentVO(agent);
    }

    public IPage<AgentVO> listAgents(PageParam pageParam, String keyword, String status, String agentType) {
        Page<Agent> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<Agent> agentPage = agentRepository.list(page, keyword, status, agentType);
        return agentPage.convert(this::toAgentVO);
    }

    public List<AgentVersionVO> listAgentVersions(Long agentId) {
        List<AgentVersion> versions = agentVersionRepository.findByAgentId(agentId);
        return versions.stream().map(this::toVersionVO).collect(Collectors.toList());
    }

    public List<AgentResourceBindingVO> listBindings(Long agentId) {
        List<AgentResourceBinding> bindings = bindingRepository.findByAgentId(agentId);
        return bindings.stream().map(b -> toBindingVOWithStatus(b, null)).collect(Collectors.toList());
    }

    /** 按类型查询绑定列表（含资源状态实时校验） */
    public List<AgentResourceBindingVO> listBindingsByType(Long agentId, String resourceType) {
        List<AgentResourceBinding> bindings = bindingRepository.findByAgentIdAndType(agentId, resourceType);
        return bindings.stream().map(this::toBindingVOWithStatus).collect(Collectors.toList());
    }

    /** 查询所有已启用模型列表 */
    public List<ModelVO> listEnabledModels() {
        List<Model> models = modelRepository.listEnabled();
        return models.stream().map(m -> {
            ModelVO vo = new ModelVO();
            BeanUtils.copyProperties(m, vo);
            return vo;
        }).collect(Collectors.toList());
    }

    private AgentVO toAgentVO(Agent a) {
        AgentVO vo = new AgentVO();
        BeanUtils.copyProperties(a, vo);
        return vo;
    }

    private AgentVersionVO toVersionVO(AgentVersion v) {
        AgentVersionVO vo = new AgentVersionVO();
        vo.setNum(v.getNum());
        vo.setVersion(v.getVersion());
        vo.setVersionTag(v.getVersionTag());
        vo.setChangelog(v.getChangelog());
        vo.setConfigSnapshot(v.getConfigSnapshot());
        vo.setCreator(v.getCreator());
        vo.setPublishTime(v.getPublishTime());
        vo.setCreateTime(v.getCreateTime());
        vo.setIsCurrent(v.getIsCurrent());
        return vo;
    }

    private AgentResourceBindingVO toBindingVOWithStatus(AgentResourceBinding binding) {
        return toBindingVOWithStatus(binding, null);
    }

    private AgentResourceBindingVO toBindingVOWithStatus(AgentResourceBinding binding, String resourceName) {
        AgentResourceBindingVO vo = new AgentResourceBindingVO();
        vo.setId(binding.getId());
        vo.setNum(binding.getNum());
        vo.setAgentId(binding.getAgentId());
        vo.setResourceType(binding.getResourceType());
        vo.setResourceId(binding.getResourceId());
        vo.setResourceName(resourceName != null ? resourceName : resolveResourceName(binding));
        vo.setIsDefault(binding.getIsDefault());
        vo.setIsEnabled(binding.getIsEnabled());
        vo.setIsAvailable(checkResourceAvailable(binding));
        vo.setSortOrder(binding.getSortOrder());
        vo.setConfig(binding.getConfig());
        vo.setCreateTime(binding.getCreateTime());
        return vo;
    }

    /** 实时校验资源可用性 */
    private Boolean checkResourceAvailable(AgentResourceBinding binding) {
        if (!Boolean.TRUE.equals(binding.getIsEnabled())) {
            return false;
        }
        switch (binding.getResourceType()) {
            case "MODEL":
                Model model = modelRepository.findById(binding.getResourceId());
                return model != null && "ENABLED".equals(model.getStatus());
            case "WORKFLOW":
                Workflow workflow = workflowRepository.findById(binding.getResourceId());
                return workflow != null && "PUBLISHED".equals(workflow.getStatus());
            case "SKILL":
                Skill skill = skillRepository.findById(binding.getResourceId());
                return skill != null && "INSTALLED".equals(skill.getStatus());
            case "MCP":
                // MCP 状态校验逻辑（复用）
                return true;
            default:
                return true;
        }
    }

    /** 解析资源名称 */
    private String resolveResourceName(AgentResourceBinding binding) {
        switch (binding.getResourceType()) {
            case "MODEL":
                Model model = modelRepository.findById(binding.getResourceId());
                return model != null ? model.getModelName() : null;
            case "WORKFLOW":
                Workflow workflow = workflowRepository.findById(binding.getResourceId());
                return workflow != null ? workflow.getWorkflowName() : null;
            case "SKILL":
                Skill skill = skillRepository.findById(binding.getResourceId());
                return skill != null ? skill.getSkillName() : null;
            default:
                return null;
        }
    }
}
