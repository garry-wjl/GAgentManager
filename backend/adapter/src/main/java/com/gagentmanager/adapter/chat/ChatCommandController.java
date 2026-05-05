package com.gagentmanager.adapter.chat;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.user.ChatCommandService;
import com.gagentmanager.application.user.ChatShareService;
import com.gagentmanager.client.share.CreateShareParam;
import com.gagentmanager.client.share.InvalidateShareParam;
import com.gagentmanager.client.share.ShareResultVO;
import com.gagentmanager.client.user.*;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** 对话 Command REST 接口，处理会话创建/消息发送/会话删除/重命名等写操作请求 */
@RestController
@RequestMapping("/api/chat/command")
public class ChatCommandController extends BaseController {

    private final ChatCommandService chatCommandService;
    private final ChatShareService chatShareService;

    public ChatCommandController(ChatCommandService chatCommandService, ChatShareService chatShareService) {
        this.chatCommandService = chatCommandService;
        this.chatShareService = chatShareService;
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

    @PostMapping("/share/create")
    public Result<ShareResultVO> createShare(@Valid @RequestBody CreateShareParam param, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return success(chatShareService.createShare(param, userId));
    }

    @PostMapping("/share/invalidate")
    public Result<Void> invalidateShare(@Valid @RequestBody InvalidateShareParam param, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        chatShareService.invalidateShare(param.getShareToken(), userId);
        return success();
    }
}
