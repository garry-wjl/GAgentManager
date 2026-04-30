package com.gagentmanager.infra.mcp.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.mcp.McpVersion;
import com.gagentmanager.domain.mcp.McpVersionRepository;
import com.gagentmanager.infra.mcp.entity.McpVersionEntity;
import com.gagentmanager.infra.mcp.mapper.McpVersionMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

/** MCP 版本仓储实现 */
@Repository
public class McpVersionRepositoryImpl implements McpVersionRepository {
    private final McpVersionMapper mapper;
    public McpVersionRepositoryImpl(McpVersionMapper mapper) { this.mapper = mapper; }

    @Override
    public List<McpVersion> findByMcpId(Long mcpId) {
        LambdaQueryWrapper<McpVersionEntity> qw = new LambdaQueryWrapper<McpVersionEntity>()
                .eq(McpVersionEntity::getMcpId, mcpId).eq(McpVersionEntity::getDeleted, false);
        return mapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    @Override
    public void save(McpVersion version, Long operatorId) {
        McpVersionEntity e = toEntity(version);
        if (version.getId() == null) { mapper.insert(e); version.setId(e.getId()); }
        else { mapper.updateById(e); }
    }

    private McpVersion toDomain(McpVersionEntity e) { McpVersion d = new McpVersion(); BeanUtils.copyProperties(e, d); return d; }
    private McpVersionEntity toEntity(McpVersion d) { McpVersionEntity e = new McpVersionEntity(); BeanUtils.copyProperties(d, e); return e; }
}
