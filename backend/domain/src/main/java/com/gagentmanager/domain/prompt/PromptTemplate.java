package com.gagentmanager.domain.prompt;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/** Prompt 模板聚合根，管理推荐 Prompt 模板 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PromptTemplate extends DomainEntity {
    private String title;
    private String content;
    private String category;
    private String icon;
    private Integer sortOrder;
    private Boolean isEnabled;

    public void save(Long operatorId) {
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new Date());
        }
        this.setUpdateTime(new Date());
    }
}
