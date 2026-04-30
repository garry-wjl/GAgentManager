package com.gagentmanager.infra.skill.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.skill.entity.SkillReviewEntity;
import org.apache.ibatis.annotations.Mapper;

/** Skill 评价数据库 Mapper 接口 */
@Mapper
public interface SkillReviewMapper extends BaseMapper<SkillReviewEntity> {}
