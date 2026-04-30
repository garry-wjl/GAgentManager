package com.gagentmanager.client.agent;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/** 创建 Agent 参数，包含完整的 LLM 配置（temperature/topP/topK 等） */
@Data
public class CreateAgentParam {
    @NotBlank
    private String agentCode;
    @NotBlank
    private String agentName;
    @NotBlank
    private String agentType;
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
