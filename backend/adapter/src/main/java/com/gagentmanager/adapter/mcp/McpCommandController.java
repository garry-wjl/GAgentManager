package com.gagentmanager.adapter.mcp;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.mcp.McpCommandService;
import com.gagentmanager.client.mcp.*;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** MCP 管理端 Command REST 接口，处理 MCP 的增删改/启停/连通性测试等写操作请求 */
@RestController
@RequestMapping("/api/mcp/command")
public class McpCommandController extends BaseController {

    private final McpCommandService mcpCommandService;

    public McpCommandController(McpCommandService mcpCommandService) {
        this.mcpCommandService = mcpCommandService;
    }

    @PostMapping("/create")
    public Result<McpVO> createMcp(@Valid @RequestBody CreateMcpParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        return success(mcpCommandService.createMcp(param, operatorId));
    }

    @PostMapping("/update")
    public Result<Void> updateMcp(@Valid @RequestBody UpdateMcpParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        mcpCommandService.updateMcp(param, operatorId);
        return success();
    }

    @PostMapping("/delete")
    public Result<Void> deleteMcp(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        mcpCommandService.deleteMcp(num, operatorId);
        return success();
    }

    @PostMapping("/enable")
    public Result<Void> enableMcp(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        mcpCommandService.enableMcp(num, operatorId);
        return success();
    }

    @PostMapping("/disable")
    public Result<Void> disableMcp(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        mcpCommandService.disableMcp(num, operatorId);
        return success();
    }

    @PostMapping("/test")
    public Result<TestResult> test(@RequestParam String num) {
        return success(mcpCommandService.testMcp(num));
    }
}
