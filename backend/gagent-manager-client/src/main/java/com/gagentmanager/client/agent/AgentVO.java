package com.gagentmanager.client.agent;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/** Agent 详情视图对象，包含配置参数和管理员列表 */
@Data
public class AgentVO {
    private Long id;
    private String num;
    private String agentCode;
    private String agentName;
    private String agentType;
    private String description;
    private String iconUrl;
    private String tags;
    private String status;
    private String version;
    private String systemPrompt;
    private BigDecimal temperature;
    private Integer maxTokens;
    private BigDecimal topP;
    private Integer topK;
    private BigDecimal frequencyPenalty;
    private BigDecimal presencePenalty;
    private String stopSequences;
    private String responseFormat;
    private Integer timeoutSeconds;
    private Integer retryCount;
    private List<String> admins;
    private String createNo;
    private String updateNo;
    private Date createTime;
    private Date updateTime;
}
