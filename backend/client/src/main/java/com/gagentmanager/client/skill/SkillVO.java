package com.gagentmanager.client.skill;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/** Skill 详情视图对象，包含评分、安装数和标签信息 */
@Data
public class SkillVO {
    private Long id;
    private String num;
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
    private Date createTime;
    private Date updateTime;
}
