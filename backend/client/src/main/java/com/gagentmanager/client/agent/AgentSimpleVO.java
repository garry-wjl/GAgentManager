package com.gagentmanager.client.agent;

import lombok.Data;

/** 用户端 Agent 简版视图对象 */
@Data
public class AgentSimpleVO {
    private Long id;
    private String num;
    private String agentName;
    private String description;
    private String agentType;
    private String iconUrl;
    private String status;
}
