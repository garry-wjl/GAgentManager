package com.gagentmanager.facade.model;

import lombok.Data;
import java.util.Date;

/** 模型创建事件，触发于新建模型后 */
@Data
public class ModelCreatedEvent {
    private String modelNum;
    private String modelCode;
    private String modelName;
    private String provider;
    private String operatorId;
    private Date eventTime;
}
