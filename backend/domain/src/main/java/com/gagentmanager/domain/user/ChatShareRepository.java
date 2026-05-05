package com.gagentmanager.domain.user;

/** 对话分享仓储接口 */
public interface ChatShareRepository {
    ChatShare findByShareToken(String shareToken);
    ChatShare findBySessionId(Long sessionId);
    void save(ChatShare share, Long operatorId);
    void invalidate(String shareToken, Long operatorId);
}
