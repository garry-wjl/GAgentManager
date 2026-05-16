package com.gagentmanager.domain.user;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/** 对话分享聚合根，封装分享创建、过期校验和浏览次数统计 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ChatShare extends DomainEntity {
    private String shareToken;
    private Long sessionId;
    private Long userId;
    private Date expireTime;
    private Boolean isExpired;
    private Integer viewCount;

    public void save(Long operatorId) {
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new Date());
        }
        this.setUpdateTime(new Date());
    }

    public void invalidate(Long operatorId) {
        this.isExpired = true;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void incrementView() {
        this.viewCount++;
    }

    public void checkNotExpired() {
        if (this.isExpired != null && this.isExpired) {
            throw new RuntimeException("分享已过期");
        }
        if (this.expireTime != null && this.expireTime.before(new Date())) {
            this.isExpired = true;
            throw new RuntimeException("分享已过期");
        }
    }

    public void assertOwnership(Long currentUserId) {
        if (!this.userId.equals(currentUserId)) {
            throw new RuntimeException("分享不属于当前用户");
        }
    }
}
