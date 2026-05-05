package com.gagentmanager.domain.file;

import java.util.List;

/** 文件附件仓储接口 */
public interface FileAttachmentRepository {
    FileAttachment findByNum(String num);
    List<FileAttachment> findBySessionId(Long sessionId);
    void save(FileAttachment attachment, Long operatorId);
    void delete(String num, Long operatorId);
}
