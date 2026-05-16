package com.gagentmanager.infra.mcp.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** MCP 模板数据库实体，映射 mcp_template 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("mcp_template")
public class McpTemplateEntity extends DomainEntity {
    private String templateName;
    private String description;
    private String configPreset;
    private String category;
    private Boolean isOfficial;
    private Integer useCount;
}
