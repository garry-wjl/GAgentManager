package com.gagentmanager.domain.skill;

import java.util.List;

/** Skill 版本仓储接口 */
public interface SkillVersionRepository {
    List<SkillVersion> findBySkillId(Long skillId);
    void save(SkillVersion version, Long operatorId);
}
