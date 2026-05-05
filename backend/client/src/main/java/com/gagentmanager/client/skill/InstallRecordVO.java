package com.gagentmanager.client.skill;

import lombok.Data;

import java.util.Date;

/** Skill 安装记录视图对象，包含安装状态和失败原因 */
@Data
public class InstallRecordVO {
    private String num;
    private Long skillId;
    private String skillName;
    private String installedVersion;
    private String installStatus;
    private String installUser;
    private Date installTime;
    private String failReason;
}
