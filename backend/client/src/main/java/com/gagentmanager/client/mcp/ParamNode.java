package com.gagentmanager.client.mcp;

import lombok.Data;

import java.util.List;

/** MCP 工具参数节点，支持树形结构 */
@Data
public class ParamNode {
    private String fieldName;
    private String type;
    private String description;
    private List<ParamNode> children;
}
