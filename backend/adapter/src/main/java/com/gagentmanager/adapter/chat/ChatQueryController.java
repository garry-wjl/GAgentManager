package com.gagentmanager.adapter.chat;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.user.ChatQueryService;
import com.gagentmanager.application.user.ChatShareService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.file.FileInfoVO;
import com.gagentmanager.client.share.ShareContentVO;
import com.gagentmanager.client.user.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 对话 Query REST 接口，处理会话列表/消息查询等读操作请求 */
@RestController
@RequestMapping("/api/chat/query")
public class ChatQueryController extends BaseController {

    private final ChatQueryService chatQueryService;
    private final ChatShareService chatShareService;

    public ChatQueryController(ChatQueryService chatQueryService, ChatShareService chatShareService) {
        this.chatQueryService = chatQueryService;
        this.chatShareService = chatShareService;
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

    @GetMapping("/session/list-page")
    public Result<PageResult<SessionVO>> listSessionsWithPage(PageParam pageParam, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        IPage<SessionVO> page = chatQueryService.listSessionsWithPage(userId, pageParam);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }

    @GetMapping("/session/attachments")
    public Result<List<FileInfoVO>> listSessionAttachments(@RequestParam Long sessionId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return success(chatQueryService.listSessionAttachments(sessionId, userId));
    }

    @GetMapping("/message/list")
    public Result<PageResult<MessageVO>> listMessages(PageParam pageParam, @RequestParam Long sessionId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        IPage<MessageVO> page = chatQueryService.listMessages(pageParam, sessionId, userId);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }

    @GetMapping("/session/export-markdown")
    public Result<MarkdownExportVO> exportMarkdown(@RequestParam String sessionNum, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        String content = chatQueryService.exportSessionMarkdown(sessionNum, userId);
        MarkdownExportVO vo = new MarkdownExportVO();
        vo.setContent(content);
        return success(vo);
    }

    @GetMapping("/share/content")
    public Result<ShareContentVO> getShareContent(@RequestParam String shareToken, HttpServletRequest request) {
        return success(chatShareService.getShareContent(shareToken));
    }
}
