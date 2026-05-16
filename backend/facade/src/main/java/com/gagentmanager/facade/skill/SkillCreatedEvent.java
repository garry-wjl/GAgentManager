package com.gagentmanager.facade.skill;

import lombok.Data;
import java.util.Date;

/** Skill 创建事件，触发于新建 Skill 后 */
@Data
public class SkillCreatedEvent {
    private String skillNum;
    private String skillName;
    private String category;
    private String operatorId;
    private Date eventTime;
}
