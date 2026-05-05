package com.gagentmanager.client.rbac;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/** 为角色分配权限参数，指定资源 ID、操作 ID 和授权类型 */
@Data
public class AssignPermissionsParam {
    @NotNull
    private Long roleId;
    private List<Long> resourceIds;
    private List<Long> actionIds;
    private String grantType;
}
