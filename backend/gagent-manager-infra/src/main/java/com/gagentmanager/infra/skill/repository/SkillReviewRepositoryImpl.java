package com.gagentmanager.infra.skill.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.skill.SkillReview;
import com.gagentmanager.domain.skill.SkillReviewRepository;
import com.gagentmanager.infra.skill.entity.SkillReviewEntity;
import com.gagentmanager.infra.skill.mapper.SkillReviewMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

/** Skill 评价仓储实现 */
@Repository
public class SkillReviewRepositoryImpl implements SkillReviewRepository {
    private final SkillReviewMapper mapper;
    public SkillReviewRepositoryImpl(SkillReviewMapper mapper) { this.mapper = mapper; }

    @Override
    public IPage<SkillReview> findBySkillId(IPage<SkillReview> page, Long skillId) {
        Page<SkillReviewEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<SkillReviewEntity> qw = new LambdaQueryWrapper<SkillReviewEntity>()
                .eq(SkillReviewEntity::getSkillId, skillId).eq(SkillReviewEntity::getDeleted, false)
                .orderByDesc(SkillReviewEntity::getCreateTime);
        IPage<SkillReviewEntity> result = mapper.selectPage(mpPage, qw);
        return convertPage(result);
    }

    @Override
    public void save(SkillReview review) {
        SkillReviewEntity e = toEntity(review);
        if (review.getId() == null) { mapper.insert(e); review.setId(e.getId()); }
        else { mapper.updateById(e); }
    }

    @Override
    public boolean existsBySkillIdAndUserId(Long skillId, Long userId) {
        LambdaQueryWrapper<SkillReviewEntity> qw = new LambdaQueryWrapper<SkillReviewEntity>()
                .eq(SkillReviewEntity::getSkillId, skillId).eq(SkillReviewEntity::getUserId, userId)
                .eq(SkillReviewEntity::getDeleted, false);
        return mapper.selectCount(qw) > 0;
    }

    private SkillReview toDomain(SkillReviewEntity e) { SkillReview d = new SkillReview(); BeanUtils.copyProperties(e, d); return d; }
    private SkillReviewEntity toEntity(SkillReview d) { SkillReviewEntity e = new SkillReviewEntity(); BeanUtils.copyProperties(d, e); return e; }
    private IPage<SkillReview> convertPage(IPage<SkillReviewEntity> s) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<SkillReview> t =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(s.getCurrent(), s.getSize(), s.getTotal());
        t.setRecords(s.getRecords().stream().map(this::toDomain).toList());
        return t;
    }
}
