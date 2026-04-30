package com.gagentmanager.adapter.mcp;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.mcp.McpCommandService;
import com.gagentmanager.application.mcp.McpQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.mcp.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** MCP 管理端 REST 接口，处理 MCP 的增删改查/启停/连通性测试/版本/模板/日志请求 */
@RestController
@RequestMapping("/api/admin/mcps")
public class McpCommandController extends BaseController {

    private final McpCommandService mcpCommandService;
    private final McpQueryService mcpQueryService;

    public McpCommandController(McpCommandService mcpCommandService, McpQueryService mcpQueryService) {
        this.mcpCommandService = mcpCommandService;
        this.mcpQueryService = mcpQueryService;
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

    @GetMapping("/get")
    public Result<McpVO> get(@RequestParam Long id) {
        return success(mcpQueryService.getMcpById(id));
    }

    @GetMapping("/detail")
    public Result<McpVO> detail(@RequestParam String num) {
        return success(mcpQueryService.getMcpByNum(num));
    }

    @GetMapping("/list")
    public Result<PageResult<McpVO>> list(PageParam pageParam, String keyword, String status) {
        IPage<McpVO> page = mcpQueryService.listMcps(pageParam, keyword, status);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }

    @GetMapping("/versions")
    public Result<List<McpVersionVO>> versions(@RequestParam Long mcpId) {
        return success(mcpQueryService.listVersions(mcpId));
    }

    @GetMapping("/templates")
    public Result<List<McpTemplateVO>> templates(@RequestParam(required = false) String category) {
        return success(mcpQueryService.listTemplates(category));
    }

    @GetMapping("/logs")
    public Result<PageResult<McpLogVO>> logs(PageParam pageParam, @RequestParam Long mcpId, @RequestParam(required = false) String logLevel) {
        IPage<McpLogVO> page = mcpQueryService.listLogs(pageParam, mcpId, logLevel);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }
}
