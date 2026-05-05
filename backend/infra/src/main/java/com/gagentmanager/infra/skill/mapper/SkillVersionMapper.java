package com.gagentmanager.infra.skill.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.skill.entity.SkillVersionEntity;
import org.apache.ibatis.annotations.Mapper;

/** Skill 版本数据库 Mapper 接口 */
@Mapper
public interface SkillVersionMapper extends BaseMapper<SkillVersionEntity> {}
