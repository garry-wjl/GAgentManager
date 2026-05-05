package com.gagentmanager.application.system_config;

import com.gagentmanager.client.system_config.*;
import com.gagentmanager.domain.system_config.SystemConfig;
import com.gagentmanager.domain.system_config.SystemConfigRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** 系统配置写操作服务，提供单个/批量配置值更新 */
@Service
public class SystemConfigCommandService {

    private final SystemConfigRepository configRepository;

    public SystemConfigCommandService(SystemConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    public void updateConfig(UpdateConfigParam param, Long operatorId) {
        SystemConfig config = configRepository.findByKey(param.getConfigKey());
        if (config == null) {
            throw new BusinessException(ErrorCode.CONFIG_KEY_NOT_FOUND);
        }
        config.updateValue(param.getConfigValue(), operatorId);
        configRepository.save(config, operatorId);
    }

    public void batchUpdateConfig(BatchUpdateConfigParam param, Long operatorId) {
        for (UpdateConfigParam item : param.getConfigs()) {
            updateConfig(item, operatorId);
        }
    }
}
