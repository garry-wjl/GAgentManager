package com.gagentmanager.client.user;

import lombok.Data;

/** 消息附件视图对象 */
@Data
public class AttachmentVO {
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String mimeType;
}
