package com.gagentmanager.client.rbac;

import lombok.Data;

import java.util.List;

/** 权限资源树形视图对象，支持嵌套子资源 */
@Data
public class PermissionResourceVO {
    private Long id;
    private String num;
    private String resourceCode;
    private String resourceName;
    private String resourceType;
    private Long parentId;
    private Integer sortOrder;
    private List<PermissionResourceVO> children;
}
