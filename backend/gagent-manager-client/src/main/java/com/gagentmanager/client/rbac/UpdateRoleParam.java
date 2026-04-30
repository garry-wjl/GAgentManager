package com.gagentmanager.client.rbac;

import lombok.Data;

/** 更新角色参数，支持修改名称和描述 */
@Data
public class UpdateRoleParam {
    private Long id;
    private String roleName;
    private String description;
}
