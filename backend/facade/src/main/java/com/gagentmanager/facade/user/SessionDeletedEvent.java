package com.gagentmanager.facade.user;

import lombok.Data;
import java.util.Date;

/** 会话删除事件，触发于用户删除会话后 */
@Data
public class SessionDeletedEvent {
    private String sessionNum;
    private String userId;
    private String operatorId;
    private Date eventTime;
}
