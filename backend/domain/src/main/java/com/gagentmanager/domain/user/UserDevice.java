package com.gagentmanager.domain.user;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/** 登录设备聚合根，封装设备记录和强制下线逻辑 */
@Data
@EqualsAndHashCode(callSuper = false)
public class UserDevice extends DomainEntity {
    private Long userId;
    private String deviceToken;
    private String deviceName;
    private String ipAddress;
    private String userAgent;
    private Date loginTime;
    private Date lastActiveTime;
    private Boolean isOnline;

    public void save(Long operatorId) {
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new Date());
        }
        this.setUpdateTime(new Date());
    }

    public void kickOut(Long operatorId) {
        this.isOnline = false;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void assertCurrentDevice(String currentToken) {
        if (this.deviceToken.equals(currentToken)) {
            throw new RuntimeException("不能踢出当前设备");
        }
    }

    public void assertOwnership(Long currentUserId) {
        if (!this.userId.equals(currentUserId)) {
            throw new RuntimeException("设备不属于当前用户");
        }
    }
}
