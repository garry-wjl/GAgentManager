package com.gagentmanager.facade.skill;

import lombok.Data;
import java.util.Date;

/** Skill 安装事件，触发于用户安装 Skill 后 */
@Data
public class SkillInstalledEvent {
    private String skillNum;
    private String version;
    private String installUser;
    private String operatorId;
    private Date eventTime;
}
