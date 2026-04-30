package com.gagentmanager.domain.user;

import com.gagentmanager.facade.common.DomainEntity;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import lombok.Data;

import java.util.Date;

/** 用户聚合根，封装账号状态管理、密码管理、登录记录和 MFA 等业务规则 */
@Data
public class User extends DomainEntity {
    private String username;
    private String passwordHash;
    private String realName;
    private String nickname;
    private String phone;
    private String email;
    private String source;       // MANUAL/IMPORT/SSO/INVITE/API
    private String status;       // ENABLED/DISABLED/RESIGNED/DELETED
    private String department;
    private String avatar;
    private String notes;
    private Boolean mfaEnabled;
    private Date lastLoginTime;
    private String lastLoginIp;
    private Integer loginFailCount;
    private Date expireTime;

    public void save(Long operatorId) {
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new Date());
        }
        this.setUpdateTime(new Date());
    }

    public void delete(Long operatorId) {
        if ("DELETED".equals(this.status)) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        this.status = "DELETED";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void activate(Long operatorId) {
        this.status = "ENABLED";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void deactivate(Long operatorId) {
        this.status = "DISABLED";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void resign(Long operatorId) {
        this.status = "RESIGNED";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void resetPassword(String newPasswordHash, Long operatorId) {
        this.passwordHash = newPasswordHash;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void setPassword(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void updateProfile(String realName, String phone, String email, Long operatorId) {
        this.realName = realName;
        this.phone = phone;
        this.email = email;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void updateAvatar(String avatar, Long operatorId) {
        this.avatar = avatar;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void toggleMfa(Boolean enabled, Long operatorId) {
        this.mfaEnabled = enabled;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void recordLogin(String ip) {
        this.lastLoginTime = new Date();
        this.lastLoginIp = ip;
        this.loginFailCount = 0;
    }

    public void recordLoginFail() {
        this.loginFailCount++;
    }

    public void assertEnabled() {
        if (!"ENABLED".equals(this.status)) {
            throw new BusinessException(ErrorCode.ACCOUNT_DISABLED);
        }
    }

    public void assertNotLocked() {
        if (this.loginFailCount != null && this.loginFailCount >= 5) {
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }
    }
}
