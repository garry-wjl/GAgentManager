package com.gagentmanager.client.mcp;

import lombok.Data;

import java.util.List;

/** MCP 工具详情视图对象，包含工具名称、描述和入参/出参树形结构 */
@Data
public class ToolVO {
    private String name;
    private String description;
    private List<ParamNode> inputParams;
    private List<ParamNode> outputParams;
}
