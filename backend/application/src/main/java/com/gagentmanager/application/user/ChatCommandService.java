package com.gagentmanager.application.user;

import com.gagentmanager.client.user.*;
import com.gagentmanager.domain.user.ChatMessage;
import com.gagentmanager.domain.user.ChatMessageRepository;
import com.gagentmanager.domain.user.ChatSession;
import com.gagentmanager.domain.user.ChatSessionRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/** 对话写操作服务，负责会话创建/消息发送/会话删除/重命名，包含归属校验 */
@Service
public class ChatCommandService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;

    public ChatCommandService(ChatSessionRepository chatSessionRepository, ChatMessageRepository chatMessageRepository) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    public SessionVO createSession(CreateSessionParam param, Long userId, String operatorId) {
        ChatSession session = new ChatSession();
        BeanUtils.copyProperties(param, session);
        session.save(userId);
        chatSessionRepository.save(session, userId);
        return toSessionVO(session);
    }

    public void sendMessage(SendMessageParam param, Long userId) {
        ChatSession session = findSessionByNum(param.getSessionNum());
        session.assertOwnership(userId);
        session.incrementMessageCount();
        chatSessionRepository.save(session, userId);

        ChatMessage msg = ChatMessage.create(session.getId(), "USER", param.getContent());
        if (param.getAttachments() != null && !param.getAttachments().isEmpty()) {
            msg.setUpdateNo(String.valueOf(userId));
        }
        chatMessageRepository.save(msg);
    }

    public void deleteSession(String num, Long userId) {
        ChatSession session = findSessionByNum(num);
        session.assertOwnership(userId);
        session.delete(userId);
        chatSessionRepository.delete(num, userId);
    }

    public void renameSession(String num, String newTitle, Long userId) {
        ChatSession session = findSessionByNum(num);
        session.assertOwnership(userId);
        session.rename(newTitle, userId);
        chatSessionRepository.save(session, userId);
    }

    private ChatSession findSessionByNum(String num) {
        ChatSession session = chatSessionRepository.findByNum(num);
        if (session == null) {
            throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);
        }
        return session;
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
}
