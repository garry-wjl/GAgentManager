package com.gagentmanager.infra.skill.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.skill.Skill;
import com.gagentmanager.domain.skill.SkillRepository;
import com.gagentmanager.infra.skill.entity.SkillEntity;
import com.gagentmanager.infra.skill.mapper.SkillMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

/** Skill 仓储实现 */
@Repository
public class SkillRepositoryImpl implements SkillRepository {

    private final SkillMapper mapper;

    public SkillRepositoryImpl(SkillMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public Skill findById(Long id) {
        SkillEntity e = mapper.selectById(id);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public Skill findByNum(String num) {
        LambdaQueryWrapper<SkillEntity> qw = new LambdaQueryWrapper<SkillEntity>()
                .eq(SkillEntity::getNum, num).eq(SkillEntity::getDeleted, false);
        SkillEntity e = mapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public Skill findByCode(String skillCode) {
        LambdaQueryWrapper<SkillEntity> qw = new LambdaQueryWrapper<SkillEntity>()
                .eq(SkillEntity::getSkillCode, skillCode).eq(SkillEntity::getDeleted, false);
        SkillEntity e = mapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public IPage<Skill> list(IPage<Skill> page, String keyword, String category, String status) {
        Page<SkillEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<SkillEntity> qw = new LambdaQueryWrapper<SkillEntity>().eq(SkillEntity::getDeleted, false);
        if (StringUtils.hasText(keyword)) qw.like(SkillEntity::getSkillName, keyword);
        if (StringUtils.hasText(category)) qw.eq(SkillEntity::getCategory, category);
        if (StringUtils.hasText(status)) qw.eq(SkillEntity::getStatus, status);
        qw.orderByDesc(SkillEntity::getCreateTime);
        IPage<SkillEntity> result = mapper.selectPage(mpPage, qw);
        return convertPage(result);
    }

    @Override
    public void save(Skill skill, Long operatorId) {
        skill.save(operatorId);
        SkillEntity e = toEntity(skill);
        if (skill.getId() == null) { mapper.insert(e); skill.setId(e.getId()); }
        else { mapper.updateById(e); }
    }

    @Override
    public void delete(String num, Long operatorId) {
        Skill skill = findByNum(num);
        if (skill != null) { skill.delete(operatorId); mapper.updateById(toEntity(skill)); }
    }

    @Override
    public void incrementInstallCount(Long id) {
        SkillEntity e = mapper.selectById(id);
        if (e != null) {
            e.setInstallCount(e.getInstallCount() + 1);
            mapper.updateById(e);
        }
    }

    private Skill toDomain(SkillEntity e) { Skill d = new Skill(); BeanUtils.copyProperties(e, d); return d; }
    private SkillEntity toEntity(Skill d) { SkillEntity e = new SkillEntity(); BeanUtils.copyProperties(d, e); return e; }
    private IPage<Skill> convertPage(IPage<SkillEntity> s) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<Skill> t =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(s.getCurrent(), s.getSize(), s.getTotal());
        t.setRecords(s.getRecords().stream().map(this::toDomain).toList());
        return t;
    }
}
