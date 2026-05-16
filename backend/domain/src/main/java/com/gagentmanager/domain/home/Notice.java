package com.gagentmanager.domain.home;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import java.util.Date;

/** 公告实体，包含过期时间检查逻辑 */
@Data
public class Notice extends DomainEntity {
    private String title;
    private String content;
    private String type;
    private String severity;
    private String sender;
    private String targetUsers;
    private String link;
    private Date expireTime;

    public boolean isExpired() {
        return expireTime != null && expireTime.before(new Date());
    }
}
