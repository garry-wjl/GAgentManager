package com.gagentmanager.client.agent;

import lombok.Data;

import java.util.Date;

/** Agent 资源绑定视图对象，包含资源类型、排序和自定义配置 */
@Data
public class AgentResourceBindingVO {
    private Long id;
    private String num;
    private Long agentId;
    private String resourceType;
    private Long resourceId;
    private String resourceName;
    private Boolean isDefault;
    private Integer sortOrder;
    private String config;
    private Date createTime;
}
