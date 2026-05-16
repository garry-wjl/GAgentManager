package com.gagentmanager.adapter.agent;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.agent.AgentQueryService;
import com.gagentmanager.client.agent.*;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Agent 管理端 Query REST 接口，处理 Agent 的查询请求 */
@RestController
@RequestMapping("/api/agent/query")
public class AgentQueryController extends BaseController {

    private final AgentQueryService agentQueryService;

    public AgentQueryController(AgentQueryService agentQueryService) {
        this.agentQueryService = agentQueryService;
    }

    @GetMapping("/get")
    public Result<AgentVO> get(@RequestParam Long id) {
        return success(agentQueryService.getAgentById(id));
    }

    @GetMapping("/detail")
    public Result<AgentVO> detail(@RequestParam String num) {
        return success(agentQueryService.getAgentByNum(num));
    }

    @GetMapping("/list")
    public Result<PageResult<AgentVO>> list(PageParam pageParam, String keyword, String status, String agentType) {
        IPage<AgentVO> page = agentQueryService.listAgents(pageParam, keyword, status, agentType);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }

    @GetMapping("/versions")
    public Result<List<AgentVersionVO>> versions(@RequestParam Long agentId) {
        return success(agentQueryService.listAgentVersions(agentId));
    }

    @GetMapping("/bindings")
    public Result<List<AgentResourceBindingVO>> bindings(@RequestParam Long agentId) {
        return success(agentQueryService.listBindings(agentId));
    }

    @GetMapping("/bindings/by-type")
    public Result<List<AgentResourceBindingVO>> bindingsByType(@RequestParam Long agentId, @RequestParam String resourceType) {
        return success(agentQueryService.listBindingsByType(agentId, resourceType));
    }

    @GetMapping("/enabled-models")
    public Result<List<com.gagentmanager.client.model.ModelVO>> enabledModels() {
        return success(agentQueryService.listEnabledModels());
    }
}
