package com.gagentmanager.facade.rbac;

import lombok.Data;
import java.util.Date;

/** 权限变更事件，触发于角色-资源-操作关联变更后 */
@Data
public class PermissionChangedEvent {
    private String roleNum;
    private String resourceCode;
    private String actionCode;
    private String grantType;
    private String operatorId;
    private Date eventTime;
}
