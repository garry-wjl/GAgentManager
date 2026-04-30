package com.gagentmanager.infra.agent.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** Agent 资源绑定数据库实体，映射 agent_resource_binding 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("agent_resource_binding")
public class AgentResourceBindingEntity extends DomainEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long agentId;
    private String resourceType;
    private Long resourceId;
    private Boolean isDefault;
    private Integer sortOrder;
    private String config;
}
