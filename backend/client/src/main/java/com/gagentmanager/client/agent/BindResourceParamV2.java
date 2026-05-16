package com.gagentmanager.client.agent;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/** 绑定工作流/Skill 参数 */
@Data
public class BindResourceParamV2 {
    @NotNull
    private Long resourceId;
    private Integer sortOrder;
}
