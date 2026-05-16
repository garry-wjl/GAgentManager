package com.gagentmanager.client.agent;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/** 更新 Agent 参数，支持部分更新（仅传非空字段） */
@Data
public class UpdateAgentParam {
    private Long id;
    private String agentName;
    private String description;
    private String iconUrl;
    private List<String> tags;
    private String systemPrompt;
    private BigDecimal temperature;
    private Integer maxTokens;
    private BigDecimal topP;
    private Integer topK;
    private BigDecimal frequencyPenalty;
    private BigDecimal presencePenalty;
    private List<String> stopSequences;
    private String responseFormat;
    private Integer timeoutSeconds;
    private Integer retryCount;
}
