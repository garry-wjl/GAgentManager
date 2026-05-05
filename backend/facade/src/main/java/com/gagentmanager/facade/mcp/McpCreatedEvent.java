package com.gagentmanager.facade.mcp;

import lombok.Data;
import java.util.Date;

/** MCP 服务创建事件，触发于新建 MCP 后 */
@Data
public class McpCreatedEvent {
    private String mcpNum;
    private String mcpName;
    private String serverUrl;
    private String operatorId;
    private Date eventTime;
}
