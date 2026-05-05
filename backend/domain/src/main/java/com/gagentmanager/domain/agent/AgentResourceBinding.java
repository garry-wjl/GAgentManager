package com.gagentmanager.domain.agent;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

import java.util.Date;

/** Agent 资源绑定实体，定义 Agent 与 Model/MCP/Skill/Workflow 的关联关系 */
@Data
public class AgentResourceBinding extends DomainEntity {

    private Long agentId;
    private String resourceType;   // MODEL/SKILL/MCP/WORKFLOW
    private Long resourceId;
    private Boolean isDefault;
    private Integer sortOrder;
    private String config;         // JSON
    private Boolean isEnabled;     // Agent 级启停开关

    public static AgentResourceBinding create(Long agentId, String resourceType, Long resourceId,
                                               Boolean isDefault, Integer sortOrder, String config) {
        AgentResourceBinding binding = new AgentResourceBinding();
        binding.agentId = agentId;
        binding.resourceType = resourceType;
        binding.resourceId = resourceId;
        binding.isDefault = isDefault != null ? isDefault : false;
        binding.sortOrder = sortOrder != null ? sortOrder : 0;
        binding.config = config;
        binding.isEnabled = true;
        return binding;
    }

    public void updateConfig(String config, Long operatorId) {
        this.config = config;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    /** 启停资源：切换 isEnabled 状态 */
    public void toggleEnabled(Long operatorId) {
        this.isEnabled = !this.isEnabled;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    /** 更新排序号 */
    public void updateSort(Integer sortOrder, Long operatorId) {
        this.sortOrder = sortOrder;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }
}
