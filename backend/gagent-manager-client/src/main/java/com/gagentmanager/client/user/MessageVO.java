package com.gagentmanager.client.user;

import lombok.Data;

import java.util.Date;

/** 对话消息视图对象，包含思考链、使用的 Skill 和 Token 用量 */
@Data
public class MessageVO {
    private String num;
    private Long sessionId;
    private String role;
    private String content;
    private String thinkingChain;
    private String attachments;
    private String webPreviews;
    private String usedSkills;
    private String usedModel;
    private Integer tokenUsage;
    private Boolean isError;
    private Date createTime;
}
