package com.gagentmanager.domain.skill;

import com.baomidou.mybatisplus.core.metadata.IPage;

/** Skill 仓储接口 */
public interface SkillRepository {
    Skill findById(Long id);
    Skill findByNum(String num);
    Skill findByCode(String skillCode);
    IPage<Skill> list(IPage<Skill> page, String keyword, String category, String status);
    void save(Skill skill, Long operatorId);
    void delete(String num, Long operatorId);
    void incrementInstallCount(Long id);
}
