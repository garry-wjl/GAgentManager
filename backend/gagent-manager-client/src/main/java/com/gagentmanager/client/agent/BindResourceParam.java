package com.gagentmanager.client.agent;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/** 绑定 Agent 资源参数，指定资源类型、ID 和是否设为默认 */
@Data
public class BindResourceParam {
    @NotBlank
    private String resourceType;
    @NotNull
    private Long resourceId;
    private Boolean isDefault;
    private Integer sortOrder;
    private String config;
}
