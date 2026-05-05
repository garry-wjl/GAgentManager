package com.gagentmanager.application.user;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.file.FileInfoVO;
import com.gagentmanager.client.user.*;
import com.gagentmanager.domain.file.FileAttachment;
import com.gagentmanager.domain.file.FileAttachmentRepository;
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
    private final FileAttachmentRepository fileAttachmentRepository;

    public ChatQueryService(ChatSessionRepository chatSessionRepository, ChatMessageRepository chatMessageRepository,
                            FileAttachmentRepository fileAttachmentRepository) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.fileAttachmentRepository = fileAttachmentRepository;
    }

    public List<SessionVO> listSessions(Long userId) {
        List<ChatSession> sessions = chatSessionRepository.listByUserId(userId);
        return sessions.stream().map(this::toSessionVO).collect(Collectors.toList());
    }

    public List<SessionVO> listSessionsByAgent(Long userId, Long agentId) {
        List<ChatSession> sessions = chatSessionRepository.findByUserIdAndAgentId(userId, agentId);
        return sessions.stream().map(this::toSessionVO).collect(Collectors.toList());
    }

    public IPage<SessionVO> listSessionsWithPage(Long userId, PageParam pageParam) {
        Page<ChatSession> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<ChatSession> result = chatSessionRepository.findByUserIdWithPage(page, userId);
        return result.convert(this::toSessionVO);
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

    public List<FileInfoVO> listSessionAttachments(Long sessionId, Long userId) {
        ChatSession session = chatSessionRepository.findById(sessionId);
        if (session != null) {
            session.assertOwnership(userId);
        }
        List<FileAttachment> attachments = fileAttachmentRepository.findBySessionId(sessionId);
        return attachments.stream().map(this::toFileInfoVO).collect(Collectors.toList());
    }

    public String exportSessionMarkdown(String sessionNum, Long userId) {
        ChatSession session = findSessionByNum(sessionNum);
        session.assertOwnership(userId);
        List<ChatMessage> messages = chatMessageRepository.findBySessionId(new Page<>(1, 10000), session.getId())
                .getRecords();
        StringBuilder md = new StringBuilder();
        md.append("# ").append(session.getSessionTitle()).append("\n\n");
        for (ChatMessage msg : messages) {
            String roleLabel = "USER".equals(msg.getRole()) ? "用户" : "AI";
            md.append("**").append(roleLabel).append("**: ").append(msg.getContent()).append("\n\n");
        }
        return md.toString();
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
        vo.setReplyToMessageNum(m.getReplyToMessageId() != null ? findMessageNumById(m.getReplyToMessageId()) : null);
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

    private String findMessageNumById(Long messageId) {
        ChatMessage msg = chatMessageRepository.findById(messageId);
        return msg != null ? msg.getNum() : null;
    }

    private FileInfoVO toFileInfoVO(FileAttachment a) {
        FileInfoVO vo = new FileInfoVO();
        vo.setNum(a.getNum());
        vo.setFileUrl(a.getFileUrl());
        vo.setFileName(a.getFileName());
        vo.setFileSize(a.getFileSize());
        vo.setMimeType(a.getMimeType());
        vo.setFileType(a.getFileType());
        vo.setCreateTime(a.getCreateTime());
        return vo;
    }

    private ChatSession findSessionByNum(String num) {
        ChatSession session = chatSessionRepository.findByNum(num);
        if (session == null) {
            throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);
        }
        return session;
    }
}
