package com.gagentmanager.infra.agent.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/** Agent 数据库实体，映射 agent 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("agent")
public class AgentEntity extends DomainEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String agentCode;
    private String agentName;
    private String agentType;
    private String description;
    private String iconUrl;
    private String tags;
    private String admins;
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
}
