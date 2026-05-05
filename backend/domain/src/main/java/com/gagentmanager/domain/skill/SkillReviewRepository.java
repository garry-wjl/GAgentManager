package com.gagentmanager.domain.skill;

import com.baomidou.mybatisplus.core.metadata.IPage;

/** Skill 评价仓储接口 */
public interface SkillReviewRepository {
    IPage<SkillReview> findBySkillId(IPage<SkillReview> page, Long skillId);
    void save(SkillReview review);
    boolean existsBySkillIdAndUserId(Long skillId, Long userId);
}
