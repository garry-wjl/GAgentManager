package com.gagentmanager.domain.file;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/** 文件附件聚合根，封装附件上传和删除逻辑 */
@Data
@EqualsAndHashCode(callSuper = false)
public class FileAttachment extends DomainEntity {
    private Long sessionId;
    private Long userId;
    private String fileKey;
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String mimeType;
    private String fileType;

    public void save(Long operatorId) {
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new Date());
        }
        this.setUpdateTime(new Date());
    }

    public void delete(Long operatorId) {
        this.setDeleted(true);
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void assertOwnership(Long currentUserId) {
        if (!this.userId.equals(currentUserId)) {
            throw new RuntimeException("附件不属于当前用户");
        }
    }
}
