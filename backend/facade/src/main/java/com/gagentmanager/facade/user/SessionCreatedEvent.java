package com.gagentmanager.facade.user;

import lombok.Data;
import java.util.Date;

/** 会话创建事件，触发于用户发起新的 Agent 对话后 */
@Data
public class SessionCreatedEvent {
    private String sessionNum;
    private String userId;
    private String agentId;
    private String sessionTitle;
    private String operatorId;
    private Date eventTime;
}
