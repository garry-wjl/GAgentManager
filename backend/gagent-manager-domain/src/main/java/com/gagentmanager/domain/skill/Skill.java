package com.gagentmanager.domain.skill;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

import java.math.BigDecimal;

/** Skill 聚合根，封装安装计数、评分更新等业务逻辑 */
@Data
public class Skill extends DomainEntity {
    private String skillCode;
    private String skillName;
    private String description;
    private String icon;
    private String category;
    private String tags;
    private String version;
    private String author;
    private Integer installCount;
    private BigDecimal rating;
    private Integer ratingCount;
    private String status;
    private Boolean isOfficial;
    private Boolean isFree;
    private String minAgentVersion;

    public void save(Long operatorId) {
        if (this.installCount == null) {
            this.installCount = 0;
        }
        if (this.rating == null) {
            this.rating = BigDecimal.ZERO;
        }
        if (this.ratingCount == null) {
            this.ratingCount = 0;
        }
        if (this.status == null) {
            this.status = "NOT_INSTALLED";
        }
        if (this.isOfficial == null) {
            this.isOfficial = false;
        }
        if (this.isFree == null) {
            this.isFree = true;
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
        this.setDeleted(true);
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new java.util.Date());
    }

    public void incrementInstallCount() {
        this.installCount++;
    }

    public void updateRating(BigDecimal newRating, Integer newCount) {
        this.rating = newRating;
        this.ratingCount = newCount;
    }
}
