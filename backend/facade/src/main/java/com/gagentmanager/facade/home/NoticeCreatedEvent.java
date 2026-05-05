package com.gagentmanager.facade.home;

import lombok.Data;
import java.util.Date;

/** 公告创建事件，触发于新建公告后 */
@Data
public class NoticeCreatedEvent {
    private String noticeNum;
    private String type;
    private String targetUsers;
    private String operatorId;
    private Date eventTime;
}
