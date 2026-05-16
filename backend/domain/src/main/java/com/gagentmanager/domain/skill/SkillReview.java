package com.gagentmanager.domain.skill;

import com.gagentmanager.facade.common.DomainEntity;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import lombok.Data;

/** Skill 评价实体，创建时校验评分范围（1-5） */
@Data
public class SkillReview extends DomainEntity {
    private Long skillId;
    private Long userId;
    private String username;
    private Integer rating;
    private String content;
    private Boolean isVerified;
    private Integer replyCount;

    public static SkillReview create(Long skillId, Long userId, String username, Integer rating, String content) {
        if (rating < 1 || rating > 5) {
            throw ErrorCode.SKILL_RATING_INVALID.toException();
        }
        SkillReview r = new SkillReview();
        r.skillId = skillId;
        r.userId = userId;
        r.username = username;
        r.rating = rating;
        r.content = content;
        r.isVerified = false;
        r.replyCount = 0;
        r.setDeleted(false);
        return r;
    }
}
