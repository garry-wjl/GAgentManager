package com.gagentmanager.infra.file.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * 本地文件存储 Gateway 实现（开发环境用）
 * 生产环境替换为 MinIO/OSS 实现
 */
@Component
@ConditionalOnProperty(name = "file.storage.type", havingValue = "local", matchIfMissing = true)
public class LocalFileGateway implements com.gagentmanager.domain.file.FileGateway {

    @Value("${file.storage.local.base-path:./gagent-files}")
    private String basePath;

    @Value("${file.storage.local.url-prefix:http://localhost:8080/api/file/download?key=}")
    private String urlPrefix;

    @Override
    public String upload(InputStream input, String key, String mimeType) {
        try {
            Path filePath = Paths.get(basePath, key);
            Path parentDir = filePath.getParent();
            if (parentDir != null && !Files.exists(parentDir)) {
                Files.createDirectories(parentDir);
            }
            Files.copy(input, filePath);
            return urlPrefix + key;
        } catch (IOException e) {
            throw new RuntimeException("文件上传失败", e);
        }
    }

    @Override
    public InputStream download(String key) {
        try {
            Path filePath = Paths.get(basePath, key);
            return new FileInputStream(filePath.toFile());
        } catch (FileNotFoundException e) {
            throw new RuntimeException("文件不存在: " + key, e);
        }
    }

    @Override
    public void delete(String key) {
        try {
            Path filePath = Paths.get(basePath, key);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("文件删除失败: " + key, e);
        }
    }

    /**
     * 生成唯一的文件存储 Key
     */
    public static String generateFileKey(String originalFileName) {
        String ext = "";
        int dotIndex = originalFileName.lastIndexOf('.');
        if (dotIndex > 0) {
            ext = originalFileName.substring(dotIndex);
        }
        return System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;
    }
}
