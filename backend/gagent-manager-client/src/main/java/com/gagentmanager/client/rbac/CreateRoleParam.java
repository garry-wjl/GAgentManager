package com.gagentmanager.client.rbac;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** 创建角色参数，需提供角色编码和名称 */
@Data
public class CreateRoleParam {
    @NotBlank
    private String roleCode;
    @NotBlank
    private String roleName;
    private String description;
}
