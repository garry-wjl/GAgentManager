package com.gagentmanager.domain.user;

/** 对话会话仓储接口 */
public interface ChatSessionRepository {
    ChatSession findById(Long id);
    ChatSession findByNum(String num);
    java.util.List<ChatSession> findByUserIdAndAgentId(Long userId, Long agentId);
    java.util.List<ChatSession> listByUserId(Long userId);
    void save(ChatSession session, Long operatorId);
    void delete(String num, Long operatorId);
    void rename(String num, String newTitle, Long operatorId);
}
