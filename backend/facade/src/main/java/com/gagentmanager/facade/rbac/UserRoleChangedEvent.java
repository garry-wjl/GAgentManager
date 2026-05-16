package com.gagentmanager.facade.rbac;

import lombok.Data;
import java.util.Date;

/** 用户-角色关联变更事件，触发于分配/移除角色后 */
@Data
public class UserRoleChangedEvent {
    private String userNum;
    private String roleNum;
    private String assignType;
    private String operatorId;
    private Date eventTime;
}
