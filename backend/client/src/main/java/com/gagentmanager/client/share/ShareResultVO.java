package com.gagentmanager.client.share;

import lombok.Data;

import java.util.Date;

/** 分享创建结果视图对象 */
@Data
public class ShareResultVO {
    private String shareToken;
    private String shareUrl;
    private Date expireTime;
}
