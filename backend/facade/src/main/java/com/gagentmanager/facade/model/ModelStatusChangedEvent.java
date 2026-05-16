package com.gagentmanager.facade.model;

import lombok.Data;
import java.util.Date;

/** 模型状态变更事件，触发于启用/禁用等操作后 */
@Data
public class ModelStatusChangedEvent {
    private String modelNum;
    private String modelName;
    private String status;
    private String operatorId;
    private Date eventTime;
}
