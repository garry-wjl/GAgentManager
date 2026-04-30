package com.gagentmanager.infra.skill.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Date;

/** Skill 安装记录数据库实体，映射 skill_install_record 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("skill_install_record")
public class SkillInstallRecordEntity extends DomainEntity {
    private Long skillId;
    private String skillName;
    private String installedVersion;
    private String installStatus;
    private String installUser;
    private Date installTime;
    private String failReason;
    private String configData;
    private String boundAgents;
}
