package com.gagentmanager.facade.rbac;

import lombok.Data;
import java.util.Date;

/** 角色状态变更事件，触发于启用/禁用角色后 */
@Data
public class RoleStatusChangedEvent {
    private String roleNum;
    private String roleName;
    private Boolean isEnabled;
    private String operatorId;
    private Date eventTime;
}
