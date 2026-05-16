package com.gagentmanager.application.user;

import com.gagentmanager.client.share.CreateShareParam;
import com.gagentmanager.client.share.ShareContentVO;
import com.gagentmanager.client.share.ShareMessageVO;
import com.gagentmanager.client.share.ShareResultVO;
import com.gagentmanager.domain.agent.Agent;
import com.gagentmanager.domain.agent.AgentRepository;
import com.gagentmanager.domain.user.ChatMessage;
import com.gagentmanager.domain.user.ChatMessageRepository;
import com.gagentmanager.domain.user.ChatSession;
import com.gagentmanager.domain.user.ChatSessionRepository;
import com.gagentmanager.domain.user.ChatShare;
import com.gagentmanager.domain.user.ChatShareRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/** 对话分享服务，处理分享的创建、查看和失效 */
@Service
public class ChatShareService {

    private final ChatShareRepository chatShareRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final AgentRepository agentRepository;

    public ChatShareService(ChatShareRepository chatShareRepository,
                            ChatSessionRepository chatSessionRepository,
                            ChatMessageRepository chatMessageRepository,
                            AgentRepository agentRepository) {
        this.chatShareRepository = chatShareRepository;
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.agentRepository = agentRepository;
    }

    public ShareResultVO createShare(CreateShareParam param, Long userId) {
        ChatSession session = chatSessionRepository.findByNum(param.getSessionNum());
        if (session == null) {
            throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);
        }
        session.assertOwnership(userId);

        // Check if share already exists
        ChatShare existing = chatShareRepository.findBySessionId(session.getId());
        if (existing != null && !existing.getIsExpired()) {
            ShareResultVO vo = new ShareResultVO();
            vo.setShareToken(existing.getShareToken());
            vo.setShareUrl("/share/" + existing.getShareToken());
            vo.setExpireTime(existing.getExpireTime());
            return vo;
        }

        ChatShare share = new ChatShare();
        share.setSessionId(session.getId());
        share.setUserId(userId);
        share.setShareToken(UUID.randomUUID().toString().replace("-", ""));
        share.setExpireTime(new Date(System.currentTimeMillis() + 7L * 24 * 60 * 60 * 1000));
        share.setIsExpired(false);
        share.setViewCount(0);
        chatShareRepository.save(share, userId);

        ShareResultVO vo = new ShareResultVO();
        vo.setShareToken(share.getShareToken());
        vo.setShareUrl("/share/" + share.getShareToken());
        vo.setExpireTime(share.getExpireTime());
        return vo;
    }

    public ShareContentVO getShareContent(String shareToken) {
        ChatShare share = chatShareRepository.findByShareToken(shareToken);
        if (share == null) {
            throw new BusinessException(ErrorCode.SHARE_NOT_FOUND);
        }
        share.checkNotExpired();
        share.incrementView();
        chatShareRepository.save(share, share.getUserId());

        ChatSession session = chatSessionRepository.findById(share.getSessionId());
        if (session == null) {
            throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);
        }

        List<ChatMessage> messages = chatMessageRepository.findBySessionId(
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(1, 10000),
                session.getId()
        ).getRecords();

        String agentName = "自动";
        if (session.getAgentId() != null) {
            Agent agent = agentRepository.findById(session.getAgentId());
            if (agent != null) {
                agentName = agent.getAgentName();
            }
        }

        ShareContentVO vo = new ShareContentVO();
        vo.setSessionTitle(session.getSessionTitle());
        vo.setAgentName(agentName);
        vo.setShareTime(share.getCreateTime());
        vo.setMessages(messages.stream().map(this::toShareMessageVO).collect(Collectors.toList()));
        return vo;
    }

    public void invalidateShare(String shareToken, Long userId) {
        ChatShare share = chatShareRepository.findByShareToken(shareToken);
        if (share == null) {
            throw new BusinessException(ErrorCode.SHARE_NOT_FOUND);
        }
        share.assertOwnership(userId);
        chatShareRepository.invalidate(shareToken, userId);
    }

    private ShareMessageVO toShareMessageVO(ChatMessage m) {
        ShareMessageVO vo = new ShareMessageVO();
        vo.setNum(m.getNum());
        vo.setRole(m.getRole());
        vo.setContent(m.getContent());
        vo.setThinkingChain(m.getThinkingChain());
        vo.setCreateTime(m.getCreateTime());
        return vo;
    }
}
