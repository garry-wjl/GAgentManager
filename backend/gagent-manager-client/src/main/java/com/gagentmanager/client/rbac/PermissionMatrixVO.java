package com.gagentmanager.client.rbac;

import lombok.Data;

import java.util.List;

/** 角色权限矩阵视图对象，用于展示角色所拥有的完整资源树 */
@Data
public class PermissionMatrixVO {
    private Long roleId;
    private String roleCode;
    private List<PermissionResourceVO> resources;
}
