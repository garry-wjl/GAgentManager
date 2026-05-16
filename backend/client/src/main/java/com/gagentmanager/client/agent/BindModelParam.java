package com.gagentmanager.client.agent;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/** 绑定模型参数 */
@Data
public class BindModelParam {
    @NotNull
    private Long modelId;
}
