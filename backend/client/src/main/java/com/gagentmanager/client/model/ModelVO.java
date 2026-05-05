package com.gagentmanager.client.model;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/** 模型详情视图对象，包含连通性状态和测试错误信息 */
@Data
public class ModelVO {
    private Long id;
    private String num;
    private String modelCode;
    private String modelName;
    private String provider;
    private String apiType;
    private String description;
    private String category;
    private Integer sortOrder;
    private String baseUrl;
    private Integer timeout;
    private Integer retryCount;
    private Integer maxTokens;
    private BigDecimal minTemperature;
    private BigDecimal maxTemperature;
    private BigDecimal defaultTemperature;
    private BigDecimal defaultTopP;
    private Integer defaultTopK;
    private String capabilities;
    private String inputTypes;
    private String outputTypes;
    private String status;
    private String connectivityStatus;
    private Date lastTestTime;
    private String testErrorMessage;
    private String createNo;
    private String updateNo;
    private Date createTime;
    private Date updateTime;
}
