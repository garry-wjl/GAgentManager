package com.gagentmanager.domain.rbac;

import com.gagentmanager.facade.common.DomainEntity;
import com.gagentmanager.facade.common.ErrorCode;
import lombok.Data;

/** 角色聚合根，封装角色的启用/禁用和系统内置保护逻辑 */
@Data
public class Role extends DomainEntity {
    private String roleCode;
    private String roleName;
    private String description;
    private Boolean isSystem;
    private Boolean isEnabled;

    public void save(Long operatorId) {
        if (this.isSystem == null) {
            this.isSystem = false;
        }
        if (this.isEnabled == null) {
            this.isEnabled = true;
        }
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new java.util.Date());
        }
        this.setUpdateTime(new java.util.Date());
    }

    public void delete(Long operatorId) {
        if (Boolean.TRUE.equals(this.isSystem)) {
            throw ErrorCode.ROLE_IS_SYSTEM.toException();
        }
        this.setDeleted(true);
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new java.util.Date());
    }

    public void enable(Long operatorId) {
        this.isEnabled = true;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new java.util.Date());
    }

    public void disable(Long operatorId) {
        this.isEnabled = false;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new java.util.Date());
    }
}
