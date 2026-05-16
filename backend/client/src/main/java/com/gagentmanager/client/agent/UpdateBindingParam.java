package com.gagentmanager.client.agent;

import lombok.Data;

/** 更新资源绑定配置参数，支持修改默认值、排序和自定义配置 */
@Data
public class UpdateBindingParam {
    private Boolean isDefault;
    private Integer sortOrder;
    private String config;
}
