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

/** 系统配置查询服务，提供全部配置、公开配置和 Map 视图查询 */
@Service
public class SystemConfigQueryService {

    private final SystemConfigRepository configRepository;

    public SystemConfigQueryService(SystemConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    public List<SystemConfigVO> listConfigs() {
        List<SystemConfig> configs = configRepository.findAll();
        return configs.stream().map(this::toVO).collect(Collectors.toList());
    }

    public List<SystemConfigVO> listPublicConfigs() {
        List<SystemConfig> configs = configRepository.findPublicConfigs();
        return configs.stream().map(this::toVO).collect(Collectors.toList());
    }

    public Map<String, String> listAllAsMap() {
        return configRepository.findAllAsMap();
    }

    private SystemConfigVO toVO(SystemConfig c) {
        SystemConfigVO vo = new SystemConfigVO();
        BeanUtils.copyProperties(c, vo);
        return vo;
    }
}
