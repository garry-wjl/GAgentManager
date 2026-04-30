package com.gagentmanager.infra.skill.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

/** Skill 数据库实体，映射 skill 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("skill")
public class SkillEntity extends DomainEntity {
    private String skillCode;
    private String skillName;
    private String description;
    private String icon;
    private String category;
    private String tags;
    private String version;
    private String author;
    private Integer installCount;
    private BigDecimal rating;
    private Integer ratingCount;
    private String status;
    private Boolean isOfficial;
    private Boolean isFree;
    private String minAgentVersion;
}
