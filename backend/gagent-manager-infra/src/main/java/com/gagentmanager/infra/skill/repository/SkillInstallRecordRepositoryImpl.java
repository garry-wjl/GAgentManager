package com.gagentmanager.infra.skill.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.skill.SkillInstallRecord;
import com.gagentmanager.domain.skill.SkillInstallRecordRepository;
import com.gagentmanager.infra.skill.entity.SkillInstallRecordEntity;
import com.gagentmanager.infra.skill.mapper.SkillInstallRecordMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

/** Skill 安装记录仓储实现 */
@Repository
public class SkillInstallRecordRepositoryImpl implements SkillInstallRecordRepository {
    private final SkillInstallRecordMapper mapper;
    public SkillInstallRecordRepositoryImpl(SkillInstallRecordMapper mapper) { this.mapper = mapper; }

    @Override
    public SkillInstallRecord findBySkillAndUser(Long skillId, Long userId) {
        LambdaQueryWrapper<SkillInstallRecordEntity> qw = new LambdaQueryWrapper<SkillInstallRecordEntity>()
                .eq(SkillInstallRecordEntity::getSkillId, skillId).eq(SkillInstallRecordEntity::getInstallUser, String.valueOf(userId))
                .eq(SkillInstallRecordEntity::getDeleted, false);
        SkillInstallRecordEntity e = mapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public List<SkillInstallRecord> findBySkillId(Long skillId) {
        LambdaQueryWrapper<SkillInstallRecordEntity> qw = new LambdaQueryWrapper<SkillInstallRecordEntity>()
                .eq(SkillInstallRecordEntity::getSkillId, skillId).eq(SkillInstallRecordEntity::getDeleted, false);
        return mapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    @Override
    public void save(SkillInstallRecord record) {
        SkillInstallRecordEntity e = toEntity(record);
        if (record.getId() == null) { mapper.insert(e); record.setId(e.getId()); }
        else { mapper.updateById(e); }
    }

    private SkillInstallRecord toDomain(SkillInstallRecordEntity e) { SkillInstallRecord d = new SkillInstallRecord(); BeanUtils.copyProperties(e, d); return d; }
    private SkillInstallRecordEntity toEntity(SkillInstallRecord d) { SkillInstallRecordEntity e = new SkillInstallRecordEntity(); BeanUtils.copyProperties(d, e); return e; }
}
