package com.gagentmanager.infra.mcp.repository;

import com.gagentmanager.client.mcp.ParamNode;
import com.gagentmanager.client.mcp.ToolVO;
import com.gagentmanager.domain.mcp.McpClientGateway;
import com.gagentmanager.domain.mcp.McpService;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/** MCP 客户端网关实现，当前使用模拟数据，待 Spring AI MCP Client 集成后替换为真实实现 */
@Repository
public class McpClientGatewayImpl implements McpClientGateway {
    @Override
    public TestResult testConnectivity(McpService mcp) {
        // TODO: Implement with Spring AI MCP Client
        return new TestResult(true, 42L, null);
    }

    @Override
    public List<ToolVO> fetchTools(McpService mcp) {
        // TODO: Implement with Spring AI MCP Client - 当前返回模拟数据
        ParamNode textParam = new ParamNode();
        textParam.setFieldName("query");
        textParam.setType("string");
        textParam.setDescription("搜索关键词");
        textParam.setChildren(Collections.emptyList());

        ParamNode inputWrapper = new ParamNode();
        inputWrapper.setFieldName("params");
        inputWrapper.setType("object");
        inputWrapper.setDescription("请求参数");
        inputWrapper.setChildren(Collections.singletonList(textParam));

        ParamNode resultField = new ParamNode();
        resultField.setFieldName("results");
        resultField.setType("array");
        resultField.setDescription("搜索结果列表");
        resultField.setChildren(Collections.emptyList());

        ParamNode outputWrapper = new ParamNode();
        outputWrapper.setFieldName("response");
        outputWrapper.setType("object");
        outputWrapper.setDescription("响应数据");
        outputWrapper.setChildren(Collections.singletonList(resultField));

        ToolVO searchTool = new ToolVO();
        searchTool.setName("search_documents");
        searchTool.setDescription("搜索知识库文档");
        searchTool.setInputParams(Collections.singletonList(inputWrapper));
        searchTool.setOutputParams(Collections.singletonList(outputWrapper));

        ParamNode weatherInput = new ParamNode();
        weatherInput.setFieldName("city");
        weatherInput.setType("string");
        weatherInput.setDescription("城市名称");
        weatherInput.setChildren(Collections.emptyList());

        ParamNode weatherOutput = new ParamNode();
        weatherOutput.setFieldName("temperature");
        weatherOutput.setType("number");
        weatherOutput.setDescription("当前温度");
        weatherOutput.setChildren(Collections.emptyList());

        ToolVO weatherTool = new ToolVO();
        weatherTool.setName("get_weather");
        weatherTool.setDescription("获取指定城市的天气信息");
        weatherTool.setInputParams(Collections.singletonList(weatherInput));
        weatherTool.setOutputParams(Collections.singletonList(weatherOutput));

        return Arrays.asList(searchTool, weatherTool);
    }
}
