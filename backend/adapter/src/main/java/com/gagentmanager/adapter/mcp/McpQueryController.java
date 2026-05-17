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

    @GetMapping("/tools")
    public Result<List<ToolVO>> tools(@RequestParam String num) {
        return success(mcpQueryService.listTools(num));
    }
}
