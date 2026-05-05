package com.gagentmanager.facade.skill;

import lombok.Data;
import java.util.Date;

/** Skill 发布事件，触发于 Skill 版本发布后 */
@Data
public class SkillPublishedEvent {
    private String skillNum;
    private String version;
    private String operatorId;
    private Date eventTime;
}
