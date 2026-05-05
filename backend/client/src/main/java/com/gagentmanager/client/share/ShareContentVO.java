package com.gagentmanager.client.share;

import lombok.Data;

import java.util.Date;
import java.util.List;

/** 分享内容视图对象 */
@Data
public class ShareContentVO {
    private String sessionTitle;
    private String agentName;
    private Date shareTime;
    private List<ShareMessageVO> messages;
}
