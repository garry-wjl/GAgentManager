package com.gagentmanager.client.skill;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/** 提交 Skill 评价参数，包含评分（1-5）和可选内容 */
@Data
public class SkillReviewParam {
    private String skillNum;
    @NotNull
    private Integer rating;
    private String content;
}
