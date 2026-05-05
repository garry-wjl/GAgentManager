package com.gagentmanager.application.file;

import com.gagentmanager.client.file.FileInfoVO;
import com.gagentmanager.client.file.UploadResultVO;
import com.gagentmanager.domain.file.FileAttachment;
import com.gagentmanager.domain.file.FileAttachmentRepository;
import com.gagentmanager.domain.file.FileGateway;
import com.gagentmanager.domain.user.ChatSession;
import com.gagentmanager.domain.user.ChatSessionRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import com.gagentmanager.infra.file.gateway.LocalFileGateway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** 文件上传服务 */
@Service
public class FileUploadService {

    private final FileGateway fileGateway;
    private final FileAttachmentRepository fileAttachmentRepository;
    private final ChatSessionRepository chatSessionRepository;

    @Value("${file.storage.max-file-size:20971520}")
    private long maxFileSize;

    @Value("${file.storage.allowed-types}")
    private List<String> allowedTypes;

    public FileUploadService(FileGateway fileGateway,
                             FileAttachmentRepository fileAttachmentRepository,
                             ChatSessionRepository chatSessionRepository) {
        this.fileGateway = fileGateway;
        this.fileAttachmentRepository = fileAttachmentRepository;
        this.chatSessionRepository = chatSessionRepository;
    }

    public UploadResultVO uploadFile(String sessionNum, MultipartFile file, Long userId) {
        // Validate file size
        if (file.getSize() > maxFileSize) {
            throw new BusinessException(ErrorCode.FILE_SIZE_EXCEEDED);
        }

        // Validate MIME type
        String mimeType = file.getContentType();
        if (mimeType == null || !allowedTypes.contains(mimeType)) {
            throw new BusinessException(ErrorCode.FILE_TYPE_NOT_ALLOWED);
        }

        // Validate session ownership
        ChatSession session = chatSessionRepository.findByNum(sessionNum);
        if (session == null) {
            throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);
        }
        session.assertOwnership(userId);

        // Generate file key and upload
        String fileKey = LocalFileGateway.generateFileKey(file.getOriginalFilename());
        try (InputStream input = file.getInputStream()) {
            String fileUrl = fileGateway.upload(input, fileKey, mimeType);

            // Create attachment record
            FileAttachment attachment = new FileAttachment();
            attachment.setSessionId(session.getId());
            attachment.setUserId(userId);
            attachment.setFileKey(fileKey);
            attachment.setFileUrl(fileUrl);
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileSize(file.getSize());
            attachment.setMimeType(mimeType);
            attachment.setFileType(classifyFileType(mimeType));
            fileAttachmentRepository.save(attachment, userId);

            UploadResultVO vo = new UploadResultVO();
            vo.setNum(attachment.getNum());
            vo.setFileUrl(attachment.getFileUrl());
            vo.setFileName(attachment.getFileName());
            vo.setFileSize(attachment.getFileSize());
            vo.setMimeType(attachment.getMimeType());
            vo.setFileType(attachment.getFileType());
            return vo;
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.UPLOAD_FAILED);
        }
    }

    /**
     * 根据 MIME 类型分类文件
     */
    private String classifyFileType(String mimeType) {
        if (mimeType.startsWith("image/")) {
            return "IMAGE";
        } else if (mimeType.equals("application/pdf")) {
            return "PDF";
        } else if (mimeType.startsWith("text/") || mimeType.equals("application/json")) {
            return "TEXT";
        } else {
            return "OFFICE";
        }
    }
}
