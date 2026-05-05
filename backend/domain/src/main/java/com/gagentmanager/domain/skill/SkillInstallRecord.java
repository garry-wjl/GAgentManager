package com.gagentmanager.domain.skill;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

import java.util.Date;

/** Skill 安装记录实体，管理安装状态流转（INSTALLING/SUCCESS/FAIL/UNINSTALLED） */
@Data
public class SkillInstallRecord extends DomainEntity {
    private Long skillId;
    private String skillName;
    private String installedVersion;
    private String installStatus;  // INSTALLING/SUCCESS/FAIL/UNINSTALLED
    private String installUser;
    private Date installTime;
    private String failReason;
    private String configData;
    private String boundAgents;

    public static SkillInstallRecord create(Long skillId, String skillName, String version, String installUser) {
        SkillInstallRecord r = new SkillInstallRecord();
        r.skillId = skillId;
        r.skillName = skillName;
        r.installedVersion = version;
        r.installStatus = "INSTALLING";
        r.installUser = installUser;
        r.installTime = new Date();
        r.setDeleted(false);
        return r;
    }

    public void markSuccess() {
        this.installStatus = "SUCCESS";
    }

    public void markFail(String reason) {
        this.installStatus = "FAIL";
        this.failReason = reason;
    }

    public void uninstall() {
        this.installStatus = "UNINSTALLED";
    }
}
