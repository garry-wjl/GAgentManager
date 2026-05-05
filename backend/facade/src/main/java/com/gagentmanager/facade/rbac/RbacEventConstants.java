package com.gagentmanager.facade.rbac;

/** RBAC 权限管理事件类型常量定义 */
public class RbacEventConstants {
    public static final String ROLE_CREATED = "role_created";
    public static final String ROLE_UPDATED = "role_updated";
    public static final String ROLE_DELETED = "role_deleted";
    public static final String ROLE_ENABLED = "role_enabled";
    public static final String ROLE_DISABLED = "role_disabled";
    public static final String PERMISSION_ASSIGNED = "permission_assigned";
    public static final String PERMISSION_REVOKED = "permission_revoked";
    public static final String USER_ASSIGNED_TO_ROLE = "user_assigned_to_role";
    public static final String USER_REMOVED_FROM_ROLE = "user_removed_from_role";
}
