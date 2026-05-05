package com.gagentmanager.facade.common;

import lombok.Data;

/** 领域事件传输对象，封装事件类型、资源信息和操作者信息 */
@Data
public class DomainEventDTO {
    private String eventType;
    private String resourceType;
    private Long resourceId;
    private String resourceNum;
    private Long operatorId;
    private String operatorName;
    private Object payload;
}
