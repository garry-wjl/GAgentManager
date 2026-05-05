package com.gagentmanager.adapter.agent;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.agent.AgentCommandService;
import com.gagentmanager.client.agent.*;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** Agent 管理端 Command REST 接口，处理 Agent 的增删改/发布/部署/启停/回滚/资源绑定等写操作请求 */
@RestController
@RequestMapping("/api/agent/command")
public class AgentCommandController extends BaseController {

    private final AgentCommandService agentCommandService;

    public AgentCommandController(AgentCommandService agentCommandService) {
        this.agentCommandService = agentCommandService;
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

    @PostMapping("/bind-model")
    public Result<Void> bindModel(@RequestParam String agentNum, @Valid @RequestBody BindModelParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.bindModel(agentNum, param, operatorId);
        return success();
    }

    @PostMapping("/bind-workflow")
    public Result<Void> bindWorkflow(@RequestParam String agentNum, @Valid @RequestBody BindResourceParamV2 param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.bindWorkflow(agentNum, param, operatorId);
        return success();
    }

    @PostMapping("/unbind-workflow")
    public Result<Void> unbindWorkflow(@RequestParam String bindingNum, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.unbindWorkflow(bindingNum, operatorId);
        return success();
    }

    @PostMapping("/toggle-workflow")
    public Result<Void> toggleWorkflow(@RequestParam String bindingNum, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.toggleWorkflow(bindingNum, operatorId);
        return success();
    }

    @PostMapping("/bind-skill")
    public Result<Void> bindSkill(@RequestParam String agentNum, @Valid @RequestBody BindResourceParamV2 param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.bindSkill(agentNum, param, operatorId);
        return success();
    }

    @PostMapping("/unbind-skill")
    public Result<Void> unbindSkill(@RequestParam String bindingNum, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.unbindSkill(bindingNum, operatorId);
        return success();
    }

    @PostMapping("/update-binding-sort")
    public Result<Void> updateBindingSort(@Valid @RequestBody UpdateBindingSortParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        agentCommandService.updateBindingSort(param, operatorId);
        return success();
    }
}
