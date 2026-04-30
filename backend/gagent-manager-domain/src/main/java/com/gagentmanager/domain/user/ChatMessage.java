package com.gagentmanager.domain.user;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

/** 对话消息实体，提供用户消息和助手消息（含思考链/Token用量）的工厂方法 */
@Data
public class ChatMessage extends DomainEntity {
    private Long sessionId;
    private String role;         // USER/ASSISTANT/SYSTEM
    private String content;
    private String thinkingChain;
    private String attachments;  // JSON
    private String webPreviews;  // JSON
    private String usedSkills;   // JSON
    private String usedModel;
    private Integer tokenUsage;
    private Boolean isError;

    public static ChatMessage create(Long sessionId, String role, String content) {
        ChatMessage msg = new ChatMessage();
        msg.sessionId = sessionId;
        msg.role = role;
        msg.content = content;
        msg.isError = false;
        msg.setDeleted(false);
        return msg;
    }

    public static ChatMessage createAssistant(Long sessionId, String content, String thinkingChain, String usedModel, Integer tokenUsage) {
        ChatMessage msg = new ChatMessage();
        msg.sessionId = sessionId;
        msg.role = "ASSISTANT";
        msg.content = content;
        msg.thinkingChain = thinkingChain;
        msg.usedModel = usedModel;
        msg.tokenUsage = tokenUsage;
        msg.isError = false;
        msg.setDeleted(false);
        return msg;
    }
}
