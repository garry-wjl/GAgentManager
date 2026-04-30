package com.gagentmanager.facade.common;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

/** 领域实体基类，定义所有领域实体的公共字段（ID、编号、审计信息等） */
@Data
public abstract class DomainEntity implements Serializable {
    private Long id;
    private String num;
    private String createNo;
    private String updateNo;
    private Date createTime;
    private Date updateTime;
    private Boolean deleted;

    /** Generate a unique num if it is null (new entity). */
    protected void ensureNum() {
        if (this.num == null) {
            this.num = UUID.randomUUID().toString().replace("-", "").substring(0, 18);
        }
    }
}
