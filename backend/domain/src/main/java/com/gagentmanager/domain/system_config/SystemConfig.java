package com.gagentmanager.domain.system_config;

import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.DomainEntity;
import com.gagentmanager.facade.common.ErrorCode;
import lombok.Data;

/** 系统配置实体，封装配置值的更新保护逻辑（不可修改的项抛出异常） */
@Data
public class SystemConfig extends DomainEntity {
    private String configKey;
    private String configValue;
    private String configType;
    private String description;
    private Boolean isPublic;
    private Boolean isModifiable;

    public void updateValue(String newValue, Long operatorId) {
        if (Boolean.FALSE.equals(this.isModifiable)) {
            throw ErrorCode.CONFIG_NOT_MODIFIABLE.toException();
        }
        this.configValue = newValue;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new java.util.Date());
    }
}
