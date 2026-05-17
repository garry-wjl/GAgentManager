package com.gagentmanager.infra.mcp.entity;

import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** MCP 服务数据库实体，映射 mcp_service 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("mcp_service")
public class McpServiceEntity extends DomainEntity {
    private String mcpName;
    private String description;
    private String feature;
    private String tags;
    private String source;
    private String status;
    private String icon;
    private String configJson;
    private String requestHeaders;
    private Integer boundAgentCount;

    /** Override parent deleted with @TableLogic so MyBatis-Plus deleteById triggers soft-delete */
    @TableLogic(value = "0", delval = "1")
    private Boolean deleted;
}
