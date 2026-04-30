package com.gagentmanager.application.agent;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.agent.AgentResourceBindingVO;
import com.gagentmanager.client.agent.AgentVO;
import com.gagentmanager.client.agent.AgentVersionVO;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.domain.agent.*;
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

    public AgentQueryService(AgentRepository agentRepository, AgentVersionRepository agentVersionRepository, AgentResourceBindingRepository bindingRepository) {
        this.agentRepository = agentRepository;
        this.agentVersionRepository = agentVersionRepository;
        this.bindingRepository = bindingRepository;
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
        return bindings.stream().map(this::toBindingVO).collect(Collectors.toList());
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

    private AgentResourceBindingVO toBindingVO(AgentResourceBinding b) {
        AgentResourceBindingVO vo = new AgentResourceBindingVO();
        vo.setId(b.getId());
        vo.setNum(b.getNum());
        vo.setAgentId(b.getAgentId());
        vo.setResourceType(b.getResourceType());
        vo.setResourceId(b.getResourceId());
        vo.setIsDefault(b.getIsDefault());
        vo.setSortOrder(b.getSortOrder());
        vo.setConfig(b.getConfig());
        vo.setCreateTime(b.getCreateTime());
        return vo;
    }
}
