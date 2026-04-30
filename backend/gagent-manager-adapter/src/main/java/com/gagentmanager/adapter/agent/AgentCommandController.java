package com.gagentmanager.adapter.agent;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.agent.AgentCommandService;
import com.gagentmanager.application.agent.AgentQueryService;
import com.gagentmanager.client.agent.*;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Agent 管理端 REST 接口，处理 Agent 的增删改查/发布/部署/启停/回滚/资源绑定等请求 */
@RestController
@RequestMapping("/api/admin/agents")
public class AgentCommandController extends BaseController {

    private final AgentCommandService agentCommandService;
    private final AgentQueryService agentQueryService;

    public AgentCommandController(AgentCommandService agentCommandService, AgentQueryService agentQueryService) {
        this.agentCommandService = agentCommandService;
        this.agentQueryService = agentQueryService;
    }

    @PostMapping("/create")
    public Result<AgentVO> createAgent(@Valid @RequestBody CreateAgentParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        return success(agentCommandService.createAgent(param, operatorId));
    }

    @PostMapping("/update")
    public Result<Void> updateAgent(@Valid @RequestBody UpdateAgentParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.updateAgent(param, operatorId);
        return success();
    }

    @PostMapping("/delete")
    public Result<Void> deleteAgent(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.deleteAgent(num, operatorId);
        return success();
    }

    @PostMapping("/publish")
    public Result<Void> publishAgent(@RequestParam String num, @Valid @RequestBody PublishAgentParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.publishAgent(num, param, operatorId);
        return success();
    }

    @PostMapping("/deploy")
    public Result<Void> deployAgent(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.deployAgent(num, operatorId);
        return success();
    }

    @PostMapping("/start")
    public Result<Void> startAgent(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.startAgent(num, operatorId);
        return success();
    }

    @PostMapping("/stop")
    public Result<Void> stopAgent(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.stopAgent(num, operatorId);
        return success();
    }

    @PostMapping("/rollback")
    public Result<Void> rollbackAgent(@RequestParam String num, @RequestParam String targetVersion, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.rollbackAgent(num, targetVersion, operatorId);
        return success();
    }

    @PostMapping("/bind")
    public Result<Void> bindResource(@RequestParam String agentNum, @Valid @RequestBody BindResourceParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.bindResource(agentNum, param, operatorId);
        return success();
    }

    @PostMapping("/unbind")
    public Result<Void> unbindResource(@RequestParam String bindingNum, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.unbindResource(bindingNum, operatorId);
        return success();
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
}
