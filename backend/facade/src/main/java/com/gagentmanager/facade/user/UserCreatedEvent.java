package com.gagentmanager.facade.user;

import lombok.Data;
import java.util.Date;

/** 用户创建事件，触发于新建用户后 */
@Data
public class UserCreatedEvent {
    private String userNum;
    private String username;
    private String realName;
    private String email;
    private String operatorId;
    private Date eventTime;
}
