package com.gagentmanager.adapter.agent;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.agent.AgentUserQueryService;
import com.gagentmanager.client.agent.AgentSimpleVO;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 用户端 Agent 查询控制器 */
@RestController
@RequestMapping("/api/agent/user")
public class AgentUserController extends BaseController {

    private final AgentUserQueryService agentUserQueryService;

    public AgentUserController(AgentUserQueryService agentUserQueryService) {
        this.agentUserQueryService = agentUserQueryService;
    }

    @GetMapping("/list")
    public Result<List<AgentSimpleVO>> listAgents(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return success(agentUserQueryService.listAgentsForUser(userId));
    }

    @GetMapping("/auto-select")
    public Result<AgentSimpleVO> autoSelectAgent(@RequestParam String content, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return success(agentUserQueryService.selectAutoAgent(userId, content));
    }
}
