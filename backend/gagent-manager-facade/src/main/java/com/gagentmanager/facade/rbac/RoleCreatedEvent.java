package com.gagentmanager.facade.rbac;

import lombok.Data;
import java.util.Date;

/** 角色创建事件，触发于新建角色后 */
@Data
public class RoleCreatedEvent {
    private String roleNum;
    private String roleCode;
    private String roleName;
    private String operatorId;
    private Date eventTime;
}
