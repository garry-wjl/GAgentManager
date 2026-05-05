package com.gagentmanager.facade.user;

import lombok.Data;
import java.util.Date;

/** 用户状态变更事件，触发于激活/停用/离职等操作后 */
@Data
public class UserStatusChangedEvent {
    private String userNum;
    private String username;
    private String status;
    private String operatorId;
    private Date eventTime;
}
