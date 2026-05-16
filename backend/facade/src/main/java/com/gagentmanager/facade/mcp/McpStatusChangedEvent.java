package com.gagentmanager.facade.mcp;

import lombok.Data;
import java.util.Date;

/** MCP 服务状态变更事件，触发于启用/禁用后 */
@Data
public class McpStatusChangedEvent {
    private String mcpNum;
    private String mcpName;
    private Boolean isEnabled;
    private String operatorId;
    private Date eventTime;
}
