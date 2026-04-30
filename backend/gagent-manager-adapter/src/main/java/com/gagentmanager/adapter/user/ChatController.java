package com.gagentmanager.adapter.user;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.user.ChatCommandService;
import com.gagentmanager.application.user.ChatQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.user.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 对话 REST 接口，处理会话创建/消息发送/会话删除/重命名/列表/消息查询请求 */
@RestController
@RequestMapping("/api/chat")
public class ChatController extends BaseController {

    private final ChatCommandService chatCommandService;
    private final ChatQueryService chatQueryService;

    public ChatController(ChatCommandService chatCommandService, ChatQueryService chatQueryService) {
        this.chatCommandService = chatCommandService;
        this.chatQueryService = chatQueryService;
    }

    @PostMapping("/session/create")
    public Result<SessionVO> createSession(@Valid @RequestBody CreateSessionParam param, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        String operatorId = String.valueOf(userId);
        return success(chatCommandService.createSession(param, userId, operatorId));
    }

    @PostMapping("/session/send")
    public Result<Void> sendMessage(@Valid @RequestBody SendMessageParam param, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        chatCommandService.sendMessage(param, userId);
        return success();
    }

    @PostMapping("/session/delete")
    public Result<Void> deleteSession(@RequestParam String num, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        chatCommandService.deleteSession(num, userId);
        return success();
    }

    @PostMapping("/session/rename")
    public Result<Void> renameSession(@RequestParam String num, @RequestParam String newTitle, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        chatCommandService.renameSession(num, newTitle, userId);
        return success();
    }

    @GetMapping("/session/list")
    public Result<List<SessionVO>> listSessions(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return success(chatQueryService.listSessions(userId));
    }

    @GetMapping("/session/agent-list")
    public Result<List<SessionVO>> listSessionsByAgent(@RequestParam Long agentId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return success(chatQueryService.listSessionsByAgent(userId, agentId));
    }

    @GetMapping("/message/list")
    public Result<PageResult<MessageVO>> listMessages(PageParam pageParam, @RequestParam Long sessionId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        IPage<MessageVO> page = chatQueryService.listMessages(pageParam, sessionId, userId);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }
}
