package com.gagentmanager.domain.model;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.Date;

/** 模型聚合根，封装模型的启用/禁用、连通性测试记录等业务逻辑 */
@Data
@EqualsAndHashCode(callSuper = false)
public class Model extends DomainEntity {
    private String modelCode;
    private String modelName;
    private String provider;
    private String apiType;
    private String description;
    private String category;
    private Integer sortOrder;
    private String apiKey;           // encrypted
    private String baseUrl;
    private Integer timeout;
    private Integer retryCount;
    private Integer maxTokens;
    private BigDecimal minTemperature;
    private BigDecimal maxTemperature;
    private BigDecimal defaultTemperature;
    private BigDecimal defaultTopP;
    private Integer defaultTopK;
    private String capabilities;     // JSON
    private String inputTypes;       // JSON
    private String outputTypes;      // JSON
    private String status;           // ENABLED/DISABLED/ERROR
    private String connectivityStatus; // UNTESTED/CONNECTED/ERROR
    private Date lastTestTime;
    private String testErrorMessage;

    public void save(Long operatorId) {
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new Date());
            if (this.status == null) {
                this.status = "ENABLED";
            }
            if (this.connectivityStatus == null) {
                this.connectivityStatus = "UNTESTED";
            }
        }
        this.setUpdateTime(new Date());
    }

    public void delete(Long operatorId) {
        this.setDeleted(true);
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void enable(Long operatorId) {
        this.status = "ENABLED";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void disable(Long operatorId) {
        this.status = "DISABLED";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void recordTestResult(boolean success, Long responseTime, String errorMsg) {
        this.lastTestTime = new Date();
        if (success) {
            this.connectivityStatus = "CONNECTED";
            this.testErrorMessage = null;
        } else {
            this.connectivityStatus = "ERROR";
            this.testErrorMessage = errorMsg;
        }
        this.setUpdateTime(new Date());
    }
}
