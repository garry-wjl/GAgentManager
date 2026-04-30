package com.gagentmanager.infra.skill.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** Skill 评价数据库实体，映射 skill_review 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("skill_review")
public class SkillReviewEntity extends DomainEntity {
    private Long skillId;
    private Long userId;
    private String username;
    private Integer rating;
    private String content;
    private Boolean isVerified;
    private Integer replyCount;
}
