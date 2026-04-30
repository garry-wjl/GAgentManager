package com.gagentmanager.infra.skill.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.skill.SkillVersion;
import com.gagentmanager.domain.skill.SkillVersionRepository;
import com.gagentmanager.infra.skill.entity.SkillVersionEntity;
import com.gagentmanager.infra.skill.mapper.SkillVersionMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

/** Skill 版本仓储实现 */
@Repository
public class SkillVersionRepositoryImpl implements SkillVersionRepository {
    private final SkillVersionMapper mapper;
    public SkillVersionRepositoryImpl(SkillVersionMapper mapper) { this.mapper = mapper; }

    @Override
    public List<SkillVersion> findBySkillId(Long skillId) {
        LambdaQueryWrapper<SkillVersionEntity> qw = new LambdaQueryWrapper<SkillVersionEntity>()
                .eq(SkillVersionEntity::getSkillId, skillId).eq(SkillVersionEntity::getDeleted, false);
        return mapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    @Override
    public void save(SkillVersion version, Long operatorId) {
        SkillVersionEntity e = toEntity(version);
        if (version.getId() == null) { mapper.insert(e); version.setId(e.getId()); }
        else { mapper.updateById(e); }
    }

    private SkillVersion toDomain(SkillVersionEntity e) { SkillVersion d = new SkillVersion(); BeanUtils.copyProperties(e, d); return d; }
    private SkillVersionEntity toEntity(SkillVersion d) { SkillVersionEntity e = new SkillVersionEntity(); BeanUtils.copyProperties(d, e); return e; }
}
