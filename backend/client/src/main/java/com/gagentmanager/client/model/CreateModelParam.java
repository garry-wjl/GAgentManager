package com.gagentmanager.client.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/** 创建模型参数，包含 API 地址、超时、Token 和温度等完整配置 */
@Data
public class CreateModelParam {
    @NotBlank
    private String modelCode;
    @NotBlank
    private String modelName;
    @NotBlank
    private String provider;
    @NotBlank
    private String apiType;
    private String description;
    private String category;
    @NotBlank
    private String apiKey;
    @NotBlank
    private String baseUrl;
    private Integer timeout;
    private Integer retryCount;
    private Integer maxTokens;
    private BigDecimal minTemperature;
    private BigDecimal maxTemperature;
    private BigDecimal defaultTemperature;
    private BigDecimal defaultTopP;
    private Integer defaultTopK;
    private List<String> capabilities;
    private List<String> inputTypes;
    private List<String> outputTypes;
    private Integer sortOrder;
}
