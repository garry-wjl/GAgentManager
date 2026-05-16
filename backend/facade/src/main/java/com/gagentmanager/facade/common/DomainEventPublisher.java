package com.gagentmanager.facade.common;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

/** 领域事件发布器，封装 Spring ApplicationEventPublisher 的调用 */
@Component
public class DomainEventPublisher {

    private final ApplicationEventPublisher eventPublisher;

    public DomainEventPublisher(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    /** 发布领域事件到 Spring 事件总线 */
    public void publish(Object event) {
        eventPublisher.publishEvent(event);
    }
}
