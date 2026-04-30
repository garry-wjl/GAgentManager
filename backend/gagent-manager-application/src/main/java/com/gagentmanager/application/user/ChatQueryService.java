package com.gagentmanager.application.user;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.user.*;
import com.gagentmanager.domain.user.ChatMessage;
import com.gagentmanager.domain.user.ChatMessageRepository;
import com.gagentmanager.domain.user.ChatSession;
import com.gagentmanager.domain.user.ChatSessionRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/** 对话查询服务，提供会话列表和消息分页查询 */
@Service
public class ChatQueryService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;

    public ChatQueryService(ChatSessionRepository chatSessionRepository, ChatMessageRepository chatMessageRepository) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    public List<SessionVO> listSessions(Long userId) {
        List<ChatSession> sessions = chatSessionRepository.listByUserId(userId);
        return sessions.stream().map(this::toSessionVO).collect(Collectors.toList());
    }

    public List<SessionVO> listSessionsByAgent(Long userId, Long agentId) {
        List<ChatSession> sessions = chatSessionRepository.findByUserIdAndAgentId(userId, agentId);
        return sessions.stream().map(this::toSessionVO).collect(Collectors.toList());
    }

    public IPage<MessageVO> listMessages(PageParam pageParam, Long sessionId, Long userId) {
        ChatSession session = chatSessionRepository.findById(sessionId);
        if (session != null) {
            session.assertOwnership(userId);
        }
        Page<ChatMessage> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<ChatMessage> msgPage = chatMessageRepository.findBySessionId(page, sessionId);
        return msgPage.convert(this::toMessageVO);
    }

    private SessionVO toSessionVO(ChatSession s) {
        SessionVO vo = new SessionVO();
        vo.setId(s.getId());
        vo.setNum(s.getNum());
        vo.setSessionTitle(s.getSessionTitle());
        vo.setUserId(s.getUserId());
        vo.setAgentId(s.getAgentId());
        vo.setMessageCount(s.getMessageCount());
        vo.setLastMessageTime(s.getLastMessageTime());
        vo.setCreateTime(s.getCreateTime());
        return vo;
    }

    private MessageVO toMessageVO(ChatMessage m) {
        MessageVO vo = new MessageVO();
        vo.setNum(m.getNum());
        vo.setSessionId(m.getSessionId());
        vo.setRole(m.getRole());
        vo.setContent(m.getContent());
        vo.setThinkingChain(m.getThinkingChain());
        vo.setAttachments(m.getAttachments());
        vo.setWebPreviews(m.getWebPreviews());
        vo.setUsedSkills(m.getUsedSkills());
        vo.setUsedModel(m.getUsedModel());
        vo.setTokenUsage(m.getTokenUsage());
        vo.setIsError(m.getIsError());
        vo.setCreateTime(m.getCreateTime());
        return vo;
    }
}
