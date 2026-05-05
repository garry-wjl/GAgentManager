package com.gagentmanager.infra.skill.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.skill.entity.SkillEntity;
import org.apache.ibatis.annotations.Mapper;

/** Skill 数据库 Mapper 接口 */
@Mapper
public interface SkillMapper extends BaseMapper<SkillEntity> {}
