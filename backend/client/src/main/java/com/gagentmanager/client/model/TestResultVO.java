package com.gagentmanager.client.model;

import lombok.Data;

@Data
public class TestResultVO {
    private Boolean success;
    private Long responseTime;
    private String errorMessage;
}
