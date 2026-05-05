package com.gagentmanager.domain.mcp;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

/** MCP 配置模板实体，用于快速创建 MCP 服务 */
@Data
public class McpTemplate extends DomainEntity {
    private String templateName;
    private String description;
    private String configPreset;
    private String category;
    private Boolean isOfficial;
    private Integer useCount;
}
