package com.gagentmanager.domain.mcp;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

import java.util.Date;

/** MCP 版本实体，管理版本发布和配置快照 */
@Data
public class McpVersion extends DomainEntity {
    private Long mcpId;
    private String version;
    private String versionTag;
    private String changelog;
    private String configSnapshot;
    private String creator;
    private Date publishTime;
    private Boolean isCurrent;

    public static McpVersion create(Long mcpId, String version, String configSnapshot, String creator) {
        McpVersion v = new McpVersion();
        v.mcpId = mcpId;
        v.version = version;
        v.configSnapshot = configSnapshot;
        v.creator = creator;
        v.versionTag = "DRAFT";
        v.isCurrent = false;
        v.setDeleted(false);
        return v;
    }
}
