package com.gagentmanager.infra.agent.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/** Agent 版本数据库实体，映射 agent_version 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("agent_version")
public class AgentVersionEntity extends DomainEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long agentId;
    private String version;
    private String versionTag;
    private String changelog;
    private String configSnapshot;
    private String creator;
    private Date publishTime;
    private Boolean isCurrent;
}
