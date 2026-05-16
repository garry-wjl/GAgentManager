package com.gagentmanager.client.skill;

import lombok.Data;

import java.util.Date;

/** Skill 评价视图对象，包含评分、内容和回复数 */
@Data
public class SkillReviewVO {
    private String num;
    private Long skillId;
    private String username;
    private Integer rating;
    private String content;
    private Boolean isVerified;
    private Integer replyCount;
    private Date createTime;
}
