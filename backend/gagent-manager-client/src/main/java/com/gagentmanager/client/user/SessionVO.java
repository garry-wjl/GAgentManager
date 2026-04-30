package com.gagentmanager.client.user;

import lombok.Data;

import java.util.Date;

/** 会话列表视图对象，包含消息数和最后消息时间 */
@Data
public class SessionVO {
    private Long id;
    private String num;
    private String sessionTitle;
    private Long userId;
    private Long agentId;
    private Integer messageCount;
    private Date lastMessageTime;
    private Date createTime;
}
