package com.gagentmanager.infra.skill.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Date;

/** Skill 版本数据库实体，映射 skill_version 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("skill_version")
public class SkillVersionEntity extends DomainEntity {
    private Long skillId;
    private String version;
    private String versionTag;
    private String changelog;
    private String creator;
    private Date publishTime;
}
