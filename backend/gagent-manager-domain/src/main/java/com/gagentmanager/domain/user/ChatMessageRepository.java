package com.gagentmanager.domain.user;

import com.baomidou.mybatisplus.core.metadata.IPage;

/** 对话消息仓储接口，支持批量保存 */
public interface ChatMessageRepository {
    ChatMessage findByNum(String num);
    IPage<ChatMessage> findBySessionId(IPage<ChatMessage> page, Long sessionId);
    void save(ChatMessage message);
    void batchSave(java.util.List<ChatMessage> messages);
}
