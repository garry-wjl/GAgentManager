package com.gagentmanager.infra.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.Date;

/** 模型数据库实体，映射 model 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("model")
public class ModelEntity extends DomainEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String modelCode;
    private String modelName;
    private String provider;
    private String apiType;
    private String description;
    private String category;
    private Integer sortOrder;
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
    private String capabilities;
    private String inputTypes;
    private String outputTypes;
    private String status;
    private String connectivityStatus;
    private Date lastTestTime;
    private String testErrorMessage;
}
