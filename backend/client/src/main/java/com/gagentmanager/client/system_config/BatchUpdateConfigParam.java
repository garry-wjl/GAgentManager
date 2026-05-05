package com.gagentmanager.client.system_config;

import lombok.Data;

import java.util.List;

/** 批量更新配置项参数，包含多个 UpdateConfigParam */
@Data
public class BatchUpdateConfigParam {
    private List<UpdateConfigParam> configs;
}
