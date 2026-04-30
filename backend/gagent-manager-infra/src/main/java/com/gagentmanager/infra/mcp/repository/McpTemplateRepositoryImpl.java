package com.gagentmanager.infra.mcp.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.mcp.McpTemplate;
import com.gagentmanager.domain.mcp.McpTemplateRepository;
import com.gagentmanager.infra.mcp.entity.McpTemplateEntity;
import com.gagentmanager.infra.mcp.mapper.McpTemplateMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

/** MCP 模板仓储实现 */
@Repository
public class McpTemplateRepositoryImpl implements McpTemplateRepository {
    private final McpTemplateMapper mapper;
    public McpTemplateRepositoryImpl(McpTemplateMapper mapper) { this.mapper = mapper; }

    @Override
    public List<McpTemplate> findByCategory(String category) {
        LambdaQueryWrapper<McpTemplateEntity> qw = new LambdaQueryWrapper<McpTemplateEntity>()
                .eq(McpTemplateEntity::getDeleted, false);
        if (StringUtils.hasText(category)) qw.eq(McpTemplateEntity::getCategory, category);
        return mapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    @Override
    public List<McpTemplate> findAll() {
        LambdaQueryWrapper<McpTemplateEntity> qw = new LambdaQueryWrapper<McpTemplateEntity>()
                .eq(McpTemplateEntity::getDeleted, false);
        return mapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    private McpTemplate toDomain(McpTemplateEntity e) { McpTemplate d = new McpTemplate(); BeanUtils.copyProperties(e, d); return d; }
}
