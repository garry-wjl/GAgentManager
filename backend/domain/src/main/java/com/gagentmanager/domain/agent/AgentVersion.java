package com.gagentmanager.domain.agent;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/** Agent 版本实体，管理版本发布、配置快照和当前版本标记 */
@Data
@EqualsAndHashCode(callSuper = false)
public class AgentVersion extends DomainEntity {

    private Long agentId;
    private String version;
    private String versionTag;
    private String changelog;
    private String configSnapshot;
    private String creator;
    private Date publishTime;
    private Boolean isCurrent;

    public static AgentVersion create(Long agentId, String version, String configSnapshot, String creator) {
        AgentVersion av = new AgentVersion();
        av.agentId = agentId;
        av.version = version;
        av.configSnapshot = configSnapshot;
        av.creator = creator;
        av.isCurrent = false;
        return av;
    }

    public void publish() {
        this.publishTime = new Date();
        this.isCurrent = true;
    }

    public void unmarkCurrent() {
        this.isCurrent = false;
    }
}
