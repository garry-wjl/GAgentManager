package com.gagentmanager.domain.skill;

import java.util.List;

/** Skill 安装记录仓储接口 */
public interface SkillInstallRecordRepository {
    SkillInstallRecord findBySkillAndUser(Long skillId, Long userId);
    List<SkillInstallRecord> findBySkillId(Long skillId);
    void save(SkillInstallRecord record);
}
