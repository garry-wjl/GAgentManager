package com.gagentmanager.infra.file.gateway;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.OSSObject;
import com.gagentmanager.domain.file.FileGateway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.io.InputStream;

/**
 * 阿里云 OSS Gateway 实现
 */
@Component
@ConditionalOnProperty(name = "file.storage.type", havingValue = "aliyun-oss")
public class AliyunOssFileGateway implements FileGateway {

    private final OSS ossClient;
    private final String bucket;
    private final String urlPrefix;

    public AliyunOssFileGateway(
            @Value("${file.storage.aliyun-oss.endpoint}") String endpoint,
            @Value("${file.storage.aliyun-oss.bucket}") String bucket,
            @Value("${file.storage.aliyun-oss.access-key-id}") String accessKeyId,
            @Value("${file.storage.aliyun-oss.access-key-secret}") String accessKeySecret,
            @Value("${file.storage.aliyun-oss.url-prefix}") String urlPrefix) {
        this.ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        this.bucket = bucket;
        this.urlPrefix = urlPrefix;
    }

    @Override
    public String upload(InputStream input, String key, String mimeType) {
        ossClient.putObject(bucket, key, input);
        return urlPrefix + key;
    }

    @Override
    public InputStream download(String key) {
        OSSObject ossObject = ossClient.getObject(bucket, key);
        return ossObject.getObjectContent();
    }

    @Override
    public void delete(String key) {
        ossClient.deleteObject(bucket, key);
    }
}
