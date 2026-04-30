package com.gagentmanager.client.skill;

import lombok.Data;

import java.util.Date;

/** Skill 版本视图对象 */
@Data
public class SkillVersionVO {
    private String num;
    private String version;
    private String versionTag;
    private String changelog;
    private String creator;
    private Date publishTime;
    private Date createTime;
}
