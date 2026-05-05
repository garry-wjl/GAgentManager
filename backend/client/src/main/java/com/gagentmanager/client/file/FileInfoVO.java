package com.gagentmanager.client.file;

import lombok.Data;

import java.util.Date;

/** 文件信息视图对象 */
@Data
public class FileInfoVO {
    private String num;
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String mimeType;
    private String fileType;
    private Date createTime;
}
