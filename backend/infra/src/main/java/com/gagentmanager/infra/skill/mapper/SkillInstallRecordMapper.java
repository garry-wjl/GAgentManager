package com.gagentmanager.infra.skill.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.skill.entity.SkillInstallRecordEntity;
import org.apache.ibatis.annotations.Mapper;

/** Skill 安装记录数据库 Mapper 接口 */
@Mapper
public interface SkillInstallRecordMapper extends BaseMapper<SkillInstallRecordEntity> {}
