package com.gagentmanager.domain.file;

import java.io.InputStream;

/** 对象存储 Gateway 接口，封装文件上传、下载和删除操作 */
public interface FileGateway {
    /**
     * 上传文件到对象存储
     * @param input 文件输入流
     * @param key 对象存储 Key
     * @param mimeType MIME 类型
     * @return 文件访问 URL
     */
    String upload(InputStream input, String key, String mimeType);

    /**
     * 从对象存储下载文件
     * @param key 对象存储 Key
     * @return 文件输入流
     */
    InputStream download(String key);

    /**
     * 从对象存储删除文件
     * @param key 对象存储 Key
     */
    void delete(String key);
}
