package com.gagentmanager.domain.user;

import com.gagentmanager.facade.common.DomainEntity;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/** 对话会话聚合根，封装会话归属校验、消息计数和重命名逻辑 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ChatSession extends DomainEntity {
    private Long userId;
    private Long agentId;
    private String sessionTitle;
    private Integer messageCount;
    private Date lastMessageTime;

    public void save(Long operatorId) {
        if (this.messageCount == null) {
            this.messageCount = 0;
        }
        if (this.userId == null) {
            this.userId = operatorId;
        }
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new Date());
        }
        this.setUpdateTime(new Date());
    }

    public void delete(Long operatorId) {
        this.setDeleted(true);
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void rename(String newTitle, Long operatorId) {
        this.sessionTitle = newTitle;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void incrementMessageCount() {
        this.messageCount++;
        this.lastMessageTime = new Date();
        this.setUpdateTime(new Date());
    }

    public void assertOwnership(Long currentUserId) {
        if (!this.userId.equals(currentUserId)) {
            throw new BusinessException(ErrorCode.SESSION_ACCESS_DENIED);
        }
    }
}
