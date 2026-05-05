package com.gagentmanager.domain.system_config;

import java.util.List;
import java.util.Map;

/** 系统配置仓储接口 */
public interface SystemConfigRepository {
    SystemConfig findByKey(String configKey);
    List<SystemConfig> findAll();
    List<SystemConfig> findPublicConfigs();
    void save(SystemConfig config, Long operatorId);
    Map<String, String> findAllAsMap();
}
