package com.gagentmanager.client.share;

import lombok.Data;

import java.util.Date;

/** 分享消息视图对象 */
@Data
public class ShareMessageVO {
    private String num;
    private String role;
    private String content;
    private String thinkingChain;
    private Date createTime;
}
