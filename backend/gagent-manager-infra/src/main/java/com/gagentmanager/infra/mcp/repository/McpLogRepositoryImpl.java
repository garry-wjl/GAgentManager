package com.gagentmanager.infra.mcp.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.mcp.McpLog;
import com.gagentmanager.domain.mcp.McpLogRepository;
import com.gagentmanager.infra.mcp.entity.McpLogEntity;
import com.gagentmanager.infra.mcp.mapper.McpLogMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

/** MCP 日志仓储实现 */
@Repository
public class McpLogRepositoryImpl implements McpLogRepository {
    private final McpLogMapper mapper;
    public McpLogRepositoryImpl(McpLogMapper mapper) { this.mapper = mapper; }

    @Override
    public IPage<McpLog> findByMcpId(IPage<McpLog> page, Long mcpId, String logLevel) {
        Page<McpLogEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<McpLogEntity> qw = new LambdaQueryWrapper<McpLogEntity>()
                .eq(McpLogEntity::getMcpId, mcpId).orderByDesc(McpLogEntity::getCreateTime);
        if (StringUtils.hasText(logLevel)) qw.eq(McpLogEntity::getLogLevel, logLevel);
        IPage<McpLogEntity> result = mapper.selectPage(mpPage, qw);
        return convertPage(result);
    }

    @Override
    public void save(McpLog log) {
        McpLogEntity e = new McpLogEntity();
        BeanUtils.copyProperties(log, e);
        mapper.insert(e);
    }

    private McpLog toDomain(McpLogEntity e) { McpLog d = new McpLog(); BeanUtils.copyProperties(e, d); return d; }
    private IPage<McpLog> convertPage(IPage<McpLogEntity> s) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<McpLog> t =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(s.getCurrent(), s.getSize(), s.getTotal());
        t.setRecords(s.getRecords().stream().map(this::toDomain).toList());
        return t;
    }
}
