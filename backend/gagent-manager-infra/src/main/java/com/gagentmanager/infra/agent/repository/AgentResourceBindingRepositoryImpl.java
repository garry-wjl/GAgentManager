package com.gagentmanager.infra.agent.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.agent.AgentResourceBinding;
import com.gagentmanager.domain.agent.AgentResourceBindingRepository;
import com.gagentmanager.infra.agent.entity.AgentResourceBindingEntity;
import com.gagentmanager.infra.agent.mapper.AgentResourceBindingMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

/** Agent 资源绑定仓储实现 */
@Repository
public class AgentResourceBindingRepositoryImpl implements AgentResourceBindingRepository {

    private final AgentResourceBindingMapper agentResourceBindingMapper;

    public AgentResourceBindingRepositoryImpl(AgentResourceBindingMapper agentResourceBindingMapper) {
        this.agentResourceBindingMapper = agentResourceBindingMapper;
    }

    @Override
    public AgentResourceBinding findById(Long id) {
        AgentResourceBindingEntity e = agentResourceBindingMapper.selectById(id);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public AgentResourceBinding findByNum(String num) {
        LambdaQueryWrapper<AgentResourceBindingEntity> qw = new LambdaQueryWrapper<AgentResourceBindingEntity>()
                .eq(AgentResourceBindingEntity::getNum, num)
                .eq(AgentResourceBindingEntity::getDeleted, false);
        AgentResourceBindingEntity e = agentResourceBindingMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public List<AgentResourceBinding> findByAgentId(Long agentId) {
        LambdaQueryWrapper<AgentResourceBindingEntity> qw = new LambdaQueryWrapper<AgentResourceBindingEntity>()
                .eq(AgentResourceBindingEntity::getAgentId, agentId)
                .eq(AgentResourceBindingEntity::getDeleted, false)
                .orderByAsc(AgentResourceBindingEntity::getSortOrder);
        List<AgentResourceBindingEntity> entities = agentResourceBindingMapper.selectList(qw);
        return entities.stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<AgentResourceBinding> findByAgentIdAndType(Long agentId, String resourceType) {
        LambdaQueryWrapper<AgentResourceBindingEntity> qw = new LambdaQueryWrapper<AgentResourceBindingEntity>()
                .eq(AgentResourceBindingEntity::getAgentId, agentId)
                .eq(AgentResourceBindingEntity::getResourceType, resourceType)
                .eq(AgentResourceBindingEntity::getDeleted, false)
                .orderByAsc(AgentResourceBindingEntity::getSortOrder);
        List<AgentResourceBindingEntity> entities = agentResourceBindingMapper.selectList(qw);
        return entities.stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public void save(AgentResourceBinding binding, Long operatorId) {
        AgentResourceBindingEntity e = toEntity(binding);
        if (binding.getId() == null) {
            agentResourceBindingMapper.insert(e);
            binding.setId(e.getId());
        } else {
            agentResourceBindingMapper.updateById(e);
        }
    }

    @Override
    public void delete(String num, Long operatorId) {
        AgentResourceBinding binding = findByNum(num);
        if (binding != null) {
            binding.setDeleted(true);
            binding.setUpdateNo(String.valueOf(operatorId));
            binding.setUpdateTime(new java.util.Date());
            agentResourceBindingMapper.updateById(toEntity(binding));
        }
    }

    @Override
    public long countByResourceId(Long resourceId) {
        LambdaQueryWrapper<AgentResourceBindingEntity> qw = new LambdaQueryWrapper<AgentResourceBindingEntity>()
                .eq(AgentResourceBindingEntity::getResourceId, resourceId)
                .eq(AgentResourceBindingEntity::getDeleted, false);
        return agentResourceBindingMapper.selectCount(qw);
    }

    private AgentResourceBinding toDomain(AgentResourceBindingEntity e) {
        AgentResourceBinding d = new AgentResourceBinding();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private AgentResourceBindingEntity toEntity(AgentResourceBinding d) {
        AgentResourceBindingEntity e = new AgentResourceBindingEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }
}
