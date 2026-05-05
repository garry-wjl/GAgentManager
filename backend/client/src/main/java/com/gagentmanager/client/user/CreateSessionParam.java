package com.gagentmanager.client.user;

import lombok.Data;

/** 创建对话会话参数，指定关联的 Agent 和会话标题 */
@Data
public class CreateSessionParam {
    private Long agentId;
    private String sessionTitle;
}
