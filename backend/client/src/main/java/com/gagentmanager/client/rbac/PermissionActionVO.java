package com.gagentmanager.client.rbac;

import lombok.Data;

/** 权限操作视图对象，如 read/write/delete */
@Data
public class PermissionActionVO {
    private Long id;
    private String num;
    private String actionCode;
    private String actionName;
    private String description;
}
