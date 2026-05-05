package com.gagentmanager.client.file;

import lombok.Data;

/** 文件上传结果视图对象 */
@Data
public class UploadResultVO {
    private String num;
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String mimeType;
    private String fileType;
}
