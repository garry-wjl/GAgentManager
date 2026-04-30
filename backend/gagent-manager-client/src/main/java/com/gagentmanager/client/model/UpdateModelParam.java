package com.gagentmanager.client.model;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/** 更新模型参数，支持部分字段更新 */
@Data
public class UpdateModelParam {
    private Long id;
    private String modelName;
    private String description;
    private String category;
    private String apiKey;
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
