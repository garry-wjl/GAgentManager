package com.gagentmanager.client.home;

import lombok.Data;

import java.util.Date;

/** 公告视图对象，包含标题、内容、类型和过期时间 */
@Data
public class NoticeVO {
    private String num;
    private String title;
    private String content;
    private String type;
    private String severity;
    private String sender;
    private String link;
    private Date expireTime;
    private Boolean isRead;
    private Date createTime;
}
