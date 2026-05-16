package com.gagentmanager.infra.prompt.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.prompt.PromptTemplate;
import com.gagentmanager.domain.prompt.PromptRepository;
import com.gagentmanager.infra.prompt.entity.PromptTemplateEntity;
import com.gagentmanager.infra.prompt.mapper.PromptMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

/** Prompt 模板仓储实现 */
@Repository
public class PromptRepositoryImpl implements PromptRepository {

    private final PromptMapper promptMapper;

    public PromptRepositoryImpl(PromptMapper promptMapper) {
        this.promptMapper = promptMapper;
    }

    @Override
    public List<PromptTemplate> listEnabled() {
        LambdaQueryWrapper<PromptTemplateEntity> qw = new LambdaQueryWrapper<PromptTemplateEntity>()
                .eq(PromptTemplateEntity::getIsEnabled, true)
                .eq(PromptTemplateEntity::getDeleted, false)
                .orderByAsc(PromptTemplateEntity::getSortOrder);
        List<PromptTemplateEntity> entities = promptMapper.selectList(qw);
        return entities.stream().map(this::toDomain).collect(Collectors.toList());
    }

    private PromptTemplate toDomain(PromptTemplateEntity e) {
        PromptTemplate d = new PromptTemplate();
        BeanUtils.copyProperties(e, d);
        return d;
    }
}
