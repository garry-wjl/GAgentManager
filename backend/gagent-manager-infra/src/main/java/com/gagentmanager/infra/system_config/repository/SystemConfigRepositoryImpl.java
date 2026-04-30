package com.gagentmanager.infra.system_config.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.system_config.SystemConfig;
import com.gagentmanager.domain.system_config.SystemConfigRepository;
import com.gagentmanager.infra.system_config.entity.SystemConfigEntity;
import com.gagentmanager.infra.system_config.mapper.SystemConfigMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** 系统配置仓储实现，提供按 Key 查询、公开配置过滤和 Map 视图转换 */
@Repository
public class SystemConfigRepositoryImpl implements SystemConfigRepository {

    private final SystemConfigMapper mapper;

    public SystemConfigRepositoryImpl(SystemConfigMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public SystemConfig findByKey(String configKey) {
        LambdaQueryWrapper<SystemConfigEntity> qw = new LambdaQueryWrapper<SystemConfigEntity>()
                .eq(SystemConfigEntity::getConfigKey, configKey);
        SystemConfigEntity e = mapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public List<SystemConfig> findAll() {
        return mapper.selectList(null).stream().map(this::toDomain).toList();
    }

    @Override
    public List<SystemConfig> findPublicConfigs() {
        LambdaQueryWrapper<SystemConfigEntity> qw = new LambdaQueryWrapper<SystemConfigEntity>()
                .eq(SystemConfigEntity::getIsPublic, true);
        return mapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    @Override
    public void save(SystemConfig config, Long operatorId) {
        config.updateValue(config.getConfigValue(), operatorId);
        mapper.updateById(toEntity(config));
    }

    @Override
    public Map<String, String> findAllAsMap() {
        Map<String, String> map = new HashMap<>();
        findAll().forEach(c -> map.put(c.getConfigKey(), c.getConfigValue()));
        return map;
    }

    private SystemConfig toDomain(SystemConfigEntity e) {
        SystemConfig d = new SystemConfig();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private SystemConfigEntity toEntity(SystemConfig d) {
        SystemConfigEntity e = new SystemConfigEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }
}
