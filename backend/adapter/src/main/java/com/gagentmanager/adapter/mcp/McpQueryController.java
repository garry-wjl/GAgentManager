package com.gagentmanager.adapter.mcp;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.mcp.McpQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.mcp.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** MCP 管理端 Query REST 接口，处理 MCP 的查询请求 */
@RestController
@RequestMapping("/api/mcp/query")
public class McpQueryController extends BaseController {

    private final McpQueryService mcpQueryService;

    public McpQueryController(McpQueryService mcpQueryService) {
        this.mcpQueryService = mcpQueryService;
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
