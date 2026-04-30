package com.gagentmanager.infra.mcp.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.mcp.McpService;
import com.gagentmanager.domain.mcp.McpRepository;
import com.gagentmanager.infra.mcp.entity.McpServiceEntity;
import com.gagentmanager.infra.mcp.mapper.McpServiceMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

/** MCP 服务仓储实现 */
@Repository
public class McpRepositoryImpl implements McpRepository {
    private final McpServiceMapper mapper;
    public McpRepositoryImpl(McpServiceMapper mapper) { this.mapper = mapper; }

    @Override
    public McpService findById(Long id) {
        McpServiceEntity e = mapper.selectById(id);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public McpService findByNum(String num) {
        LambdaQueryWrapper<McpServiceEntity> qw = new LambdaQueryWrapper<McpServiceEntity>()
                .eq(McpServiceEntity::getNum, num).eq(McpServiceEntity::getDeleted, false);
        McpServiceEntity e = mapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public McpService findByCode(String mcpCode) {
        LambdaQueryWrapper<McpServiceEntity> qw = new LambdaQueryWrapper<McpServiceEntity>()
                .eq(McpServiceEntity::getMcpCode, mcpCode).eq(McpServiceEntity::getDeleted, false);
        McpServiceEntity e = mapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public IPage<McpService> list(IPage<McpService> page, String keyword, String status) {
        Page<McpServiceEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<McpServiceEntity> qw = new LambdaQueryWrapper<McpServiceEntity>().eq(McpServiceEntity::getDeleted, false);
        if (StringUtils.hasText(keyword)) qw.and(w -> w.like(McpServiceEntity::getMcpCode, keyword).or().like(McpServiceEntity::getMcpName, keyword));
        if (StringUtils.hasText(status)) qw.eq(McpServiceEntity::getStatus, status);
        qw.orderByDesc(McpServiceEntity::getCreateTime);
        IPage<McpServiceEntity> result = mapper.selectPage(mpPage, qw);
        return convertPage(result);
    }

    @Override
    public void save(McpService mcp, Long operatorId) {
        mcp.save(operatorId);
        McpServiceEntity e = toEntity(mcp);
        if (mcp.getId() == null) { mapper.insert(e); mcp.setId(e.getId()); }
        else { mapper.updateById(e); }
    }

    @Override
    public void delete(String num, Long operatorId) {
        McpService mcp = findByNum(num);
        if (mcp != null) { mcp.delete(operatorId); mapper.updateById(toEntity(mcp)); }
    }

    @Override
    public List<McpService> findEnabledMcps() {
        LambdaQueryWrapper<McpServiceEntity> qw = new LambdaQueryWrapper<McpServiceEntity>()
                .eq(McpServiceEntity::getDeleted, false).eq(McpServiceEntity::getIsEnabled, true);
        return mapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    private McpService toDomain(McpServiceEntity e) { McpService d = new McpService(); BeanUtils.copyProperties(e, d); return d; }
    private McpServiceEntity toEntity(McpService d) { McpServiceEntity e = new McpServiceEntity(); BeanUtils.copyProperties(d, e); return e; }
    private IPage<McpService> convertPage(IPage<McpServiceEntity> s) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<McpService> t =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(s.getCurrent(), s.getSize(), s.getTotal());
        t.setRecords(s.getRecords().stream().map(this::toDomain).toList());
        return t;
    }
}
