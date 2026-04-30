package com.gagentmanager.client.system_config;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** 更新单个配置项参数 */
@Data
public class UpdateConfigParam {
    @NotBlank
    private String configKey;
    @NotBlank
    private String configValue;
}
