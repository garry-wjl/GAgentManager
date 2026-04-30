package com.gagentmanager.infra.agent.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.agent.Agent;
import com.gagentmanager.domain.agent.AgentRepository;
import com.gagentmanager.infra.agent.entity.AgentEntity;
import com.gagentmanager.infra.agent.mapper.AgentMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.stream.Collectors;

/** Agent 仓储实现，负责领域对象与数据库实体之间的转换和持久化操作 */
@Repository
public class AgentRepositoryImpl implements AgentRepository {

    private final AgentMapper agentMapper;

    public AgentRepositoryImpl(AgentMapper agentMapper) {
        this.agentMapper = agentMapper;
    }

    @Override
    public Agent findById(Long id) {
        AgentEntity e = agentMapper.selectById(id);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public Agent findByNum(String num) {
        LambdaQueryWrapper<AgentEntity> qw = new LambdaQueryWrapper<AgentEntity>()
                .eq(AgentEntity::getNum, num)
                .eq(AgentEntity::getDeleted, false);
        AgentEntity e = agentMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public Agent findByCode(String code) {
        LambdaQueryWrapper<AgentEntity> qw = new LambdaQueryWrapper<AgentEntity>()
                .eq(AgentEntity::getAgentCode, code)
                .eq(AgentEntity::getDeleted, false);
        AgentEntity e = agentMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public IPage<Agent> list(IPage<Agent> page, String keyword, String status, String agentType) {
        Page<AgentEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<AgentEntity> qw = new LambdaQueryWrapper<AgentEntity>()
                .eq(AgentEntity::getDeleted, false);
        if (StringUtils.hasText(keyword)) {
            qw.and(w -> w.like(AgentEntity::getAgentName, keyword)
                    .or().like(AgentEntity::getAgentCode, keyword)
                    .or().like(AgentEntity::getDescription, keyword));
        }
        if (StringUtils.hasText(status)) {
            qw.eq(AgentEntity::getStatus, status);
        }
        if (StringUtils.hasText(agentType)) {
            qw.eq(AgentEntity::getAgentType, agentType);
        }
        qw.orderByDesc(AgentEntity::getCreateTime);
        IPage<AgentEntity> result = agentMapper.selectPage(mpPage, qw);
        return convertPage(result, this::toDomain);
    }

    @Override
    public void save(Agent agent, Long operatorId) {
        agent.save(operatorId);
        AgentEntity e = toEntity(agent);
        if (agent.getId() == null) {
            agentMapper.insert(e);
            agent.setId(e.getId());
        } else {
            agentMapper.updateById(e);
        }
    }

    @Override
    public void delete(String num, Long operatorId) {
        Agent agent = findByNum(num);
        if (agent != null) {
            agent.delete(operatorId);
            agentMapper.updateById(toEntity(agent));
        }
    }

    @Override
    public IPage<Agent> listByStatus(IPage<Agent> page, String status) {
        Page<AgentEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<AgentEntity> qw = new LambdaQueryWrapper<AgentEntity>()
                .eq(AgentEntity::getStatus, status)
                .eq(AgentEntity::getDeleted, false)
                .orderByDesc(AgentEntity::getCreateTime);
        IPage<AgentEntity> result = agentMapper.selectPage(mpPage, qw);
        return convertPage(result, this::toDomain);
    }

    @Override
    public long count() {
        LambdaQueryWrapper<AgentEntity> qw = new LambdaQueryWrapper<AgentEntity>()
                .eq(AgentEntity::getDeleted, false);
        return agentMapper.selectCount(qw);
    }

    @Override
    public long countOnline() {
        LambdaQueryWrapper<AgentEntity> qw = new LambdaQueryWrapper<AgentEntity>()
                .eq(AgentEntity::getStatus, "ONLINE")
                .eq(AgentEntity::getDeleted, false);
        return agentMapper.selectCount(qw);
    }

    private Agent toDomain(AgentEntity e) {
        Agent d = new Agent();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private AgentEntity toEntity(Agent d) {
        AgentEntity e = new AgentEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }

    private <D, E> IPage<D> convertPage(IPage<E> source, java.util.function.Function<E, D> converter) {
        Page<D> target = new Page<>(source.getCurrent(), source.getSize(), source.getTotal());
        target.setRecords(source.getRecords().stream().map(converter).collect(Collectors.toList()));
        return target;
    }
}
