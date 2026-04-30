package com.gagentmanager.client.user;

import lombok.Data;

import java.util.Date;

/** 用户交互历史视图对象，包含 Agent 名称和 Token 用量 */
@Data
public class InteractionHistoryVO {
    private String sessionNum;
    private String agentName;
    private String title;
    private Integer messageCount;
    private Integer tokenUsage;
    private Date createTime;
}
