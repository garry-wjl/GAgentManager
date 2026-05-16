package com.gagentmanager.infra.prompt.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** Prompt 模板数据库实体，映射 prompt_template 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prompt_template")
public class PromptTemplateEntity extends DomainEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;
    private String content;
    private String category;
    private String icon;
    private Integer sortOrder;
    private Boolean isEnabled;
}
