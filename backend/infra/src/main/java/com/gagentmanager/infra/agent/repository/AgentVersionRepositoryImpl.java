package com.gagentmanager.infra.agent.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.gagentmanager.domain.agent.AgentVersion;
import com.gagentmanager.domain.agent.AgentVersionRepository;
import com.gagentmanager.infra.agent.entity.AgentVersionEntity;
import com.gagentmanager.infra.agent.mapper.AgentVersionMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

/** Agent 版本仓储实现，包含切换当前版本的原子操作逻辑 */
@Repository
public class AgentVersionRepositoryImpl implements AgentVersionRepository {

    private final AgentVersionMapper agentVersionMapper;

    public AgentVersionRepositoryImpl(AgentVersionMapper agentVersionMapper) {
        this.agentVersionMapper = agentVersionMapper;
    }

    @Override
    public AgentVersion findById(Long id) {
        AgentVersionEntity e = agentVersionMapper.selectById(id);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public AgentVersion findByNum(String num) {
        LambdaQueryWrapper<AgentVersionEntity> qw = new LambdaQueryWrapper<AgentVersionEntity>()
                .eq(AgentVersionEntity::getNum, num)
                .eq(AgentVersionEntity::getDeleted, false);
        AgentVersionEntity e = agentVersionMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public List<AgentVersion> findByAgentId(Long agentId) {
        LambdaQueryWrapper<AgentVersionEntity> qw = new LambdaQueryWrapper<AgentVersionEntity>()
                .eq(AgentVersionEntity::getAgentId, agentId)
                .eq(AgentVersionEntity::getDeleted, false)
                .orderByDesc(AgentVersionEntity::getCreateTime);
        List<AgentVersionEntity> entities = agentVersionMapper.selectList(qw);
        return entities.stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public AgentVersion findByAgentIdAndVersion(Long agentId, String version) {
        LambdaQueryWrapper<AgentVersionEntity> qw = new LambdaQueryWrapper<AgentVersionEntity>()
                .eq(AgentVersionEntity::getAgentId, agentId)
                .eq(AgentVersionEntity::getVersion, version)
                .eq(AgentVersionEntity::getDeleted, false);
        AgentVersionEntity e = agentVersionMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public void save(AgentVersion version, Long operatorId) {
        AgentVersionEntity e = toEntity(version);
        if (version.getId() == null) {
            agentVersionMapper.insert(e);
            version.setId(e.getId());
        } else {
            agentVersionMapper.updateById(e);
        }
    }

    @Override
    public void markCurrent(Long agentId, String version, Long operatorId) {
        // Unmark all versions for this agent
        LambdaUpdateWrapper<AgentVersionEntity> unmarkWrapper = new LambdaUpdateWrapper<AgentVersionEntity>()
                .eq(AgentVersionEntity::getAgentId, agentId)
                .eq(AgentVersionEntity::getIsCurrent, true)
                .eq(AgentVersionEntity::getDeleted, false);
        AgentVersionEntity unmarkEntity = new AgentVersionEntity();
        unmarkEntity.setIsCurrent(false);
        agentVersionMapper.update(unmarkEntity, unmarkWrapper);

        // Mark the target version as current
        LambdaUpdateWrapper<AgentVersionEntity> markWrapper = new LambdaUpdateWrapper<AgentVersionEntity>()
                .eq(AgentVersionEntity::getAgentId, agentId)
                .eq(AgentVersionEntity::getVersion, version)
                .eq(AgentVersionEntity::getDeleted, false);
        AgentVersionEntity markEntity = new AgentVersionEntity();
        markEntity.setIsCurrent(true);
        agentVersionMapper.update(markEntity, markWrapper);
    }

    private AgentVersion toDomain(AgentVersionEntity e) {
        AgentVersion d = new AgentVersion();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private AgentVersionEntity toEntity(AgentVersion d) {
        AgentVersionEntity e = new AgentVersionEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }
}
