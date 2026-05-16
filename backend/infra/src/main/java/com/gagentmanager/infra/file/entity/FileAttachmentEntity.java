package com.gagentmanager.infra.file.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** 文件附件数据库实体，映射 file_attachment 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("file_attachment")
public class FileAttachmentEntity extends DomainEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long sessionId;
    private Long userId;
    private String fileKey;
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String mimeType;
    private String fileType;
}
