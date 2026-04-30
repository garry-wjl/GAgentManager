package com.gagentmanager.infra.mcp.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Date;

/** MCP 版本数据库实体，映射 mcp_version 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("mcp_version")
public class McpVersionEntity extends DomainEntity {
    private Long mcpId;
    private String version;
    private String versionTag;
    private String changelog;
    private String configSnapshot;
    private String creator;
    private Date publishTime;
    private Boolean isCurrent;
}
