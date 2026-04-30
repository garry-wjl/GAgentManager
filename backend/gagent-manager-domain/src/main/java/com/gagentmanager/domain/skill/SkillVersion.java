package com.gagentmanager.domain.skill;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

import java.util.Date;

/** Skill 版本实体，管理版本发布状态 */
@Data
public class SkillVersion extends DomainEntity {
    private Long skillId;
    private String version;
    private String versionTag;
    private String changelog;
    private String creator;
    private Date publishTime;

    public static SkillVersion create(Long skillId, String version, String creator) {
        SkillVersion v = new SkillVersion();
        v.skillId = skillId;
        v.version = version;
        v.creator = creator;
        v.versionTag = "DRAFT";
        v.setDeleted(false);
        return v;
    }

    public void publish() {
        this.versionTag = "PUBLISHED";
        this.publishTime = new Date();
    }
}
