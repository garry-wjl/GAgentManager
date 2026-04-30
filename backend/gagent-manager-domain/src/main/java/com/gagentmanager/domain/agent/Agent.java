package com.gagentmanager.domain.agent;

import com.gagentmanager.facade.common.DomainEntity;
import com.gagentmanager.facade.common.ErrorCode;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/** Agent 聚合根，封装 Agent 的核心业务规则（状态流转、配置更新、发布部署等） */
@Data
public class Agent extends DomainEntity {
    private String agentCode;
    private String agentName;
    private String agentType;   // CHAT/WORKFLOW/ANALYSIS/AUTOMATION/HYBRID
    private String description;
    private String iconUrl;
    private String tags;        // JSON
    private String admins;      // JSON
    private String status;      // DRAFT/PUBLISHED/ONLINE/OFFLINE/ABNORMAL/PUBLISHING
    private String version;
    private String systemPrompt;
    private BigDecimal temperature;
    private Integer maxTokens;
    private BigDecimal topP;
    private Integer topK;
    private BigDecimal frequencyPenalty;
    private BigDecimal presencePenalty;
    private String stopSequences;  // JSON
    private String responseFormat;
    private Integer timeoutSeconds;
    private Integer retryCount;

    /** 保存 Agent：新建时初始化状态为 DRAFT、版本为 V1.0.0 */
    public void save(Long operatorId) {
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new Date());
            if (this.status == null) {
                this.status = "DRAFT";
            }
            if (this.version == null) {
                this.version = "V1.0.0";
            }
        }
        this.setUpdateTime(new Date());
    }

    /** 删除 Agent：在线状态不可删除，执行逻辑删除 */
    public void delete(Long operatorId) {
        if ("ONLINE".equals(this.status)) {
            throw ErrorCode.AGENT_ALREADY_ONLINE.toException();
        }
        this.setDeleted(true);
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    /** 发布 Agent：生成新版本号，状态转为 PUBLISHED */
    public void publish(String newVersion, Long operatorId) {
        this.version = newVersion;
        this.status = "PUBLISHED";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    /** 部署 Agent：仅 PUBLISHED 状态可部署，转为 ONLINE */
    public void deploy(Long operatorId) {
        if (!"PUBLISHED".equals(this.status)) {
            throw ErrorCode.AGENT_NOT_PUBLISHED.toException();
        }
        this.status = "ONLINE";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    /** 启动 Agent：已在线不可重复启动 */
    public void start(Long operatorId) {
        if ("ONLINE".equals(this.status)) {
            throw ErrorCode.AGENT_ALREADY_ONLINE.toException();
        }
        this.status = "ONLINE";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    /** 停止 Agent：已离线不可重复停止 */
    public void stop(Long operatorId) {
        if ("OFFLINE".equals(this.status)) {
            throw ErrorCode.AGENT_ALREADY_OFFLINE.toException();
        }
        this.status = "OFFLINE";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    /** 回滚到指定版本 */
    public void rollback(String targetVersion, Long operatorId) {
        this.version = targetVersion;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    /** 更新 Agent 配置：非空字段才覆盖，支持热更新 LLM 参数 */
    public void updateConfig(BigDecimal temperature, Integer maxTokens, BigDecimal topP,
                             Integer topK, BigDecimal frequencyPenalty, BigDecimal presencePenalty,
                             String stopSequences, String responseFormat, Integer timeoutSeconds,
                             Integer retryCount, String systemPrompt, Long operatorId) {
        if (temperature != null) {
            this.temperature = temperature;
        }
        if (maxTokens != null) {
            this.maxTokens = maxTokens;
        }
        if (topP != null) {
            this.topP = topP;
        }
        if (topK != null) {
            this.topK = topK;
        }
        if (frequencyPenalty != null) {
            this.frequencyPenalty = frequencyPenalty;
        }
        if (presencePenalty != null) {
            this.presencePenalty = presencePenalty;
        }
        if (stopSequences != null) {
            this.stopSequences = stopSequences;
        }
        if (responseFormat != null) {
            this.responseFormat = responseFormat;
        }
        if (timeoutSeconds != null) {
            this.timeoutSeconds = timeoutSeconds;
        }
        if (retryCount != null) {
            this.retryCount = retryCount;
        }
        if (systemPrompt != null) {
            this.systemPrompt = systemPrompt;
        }
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }
}
