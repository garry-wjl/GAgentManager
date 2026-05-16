package com.gagentmanager.adapter.file;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.file.FileUploadService;
import com.gagentmanager.client.file.UploadResultVO;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/** 文件上传控制器 */
@RestController
@RequestMapping("/api/file")
public class FileUploadController extends BaseController {

    private final FileUploadService fileUploadService;

    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/upload")
    public Result<UploadResultVO> upload(@RequestParam String sessionNum,
                                         @RequestParam("file") MultipartFile file,
                                         HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return success(fileUploadService.uploadFile(sessionNum, file, userId));
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> download(@RequestParam String fileNum, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        // For local file gateway, return the file directly
        // In production, redirect to the object storage URL
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new byte[0]);
    }
}
