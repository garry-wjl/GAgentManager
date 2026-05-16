package com.gagentmanager.client.skill;

import lombok.Data;

import java.util.List;

/** 更新 Skill 参数，支持部分字段更新 */
@Data
public class UpdateSkillParam {
    private Long id;
    private String skillName;
    private String description;
    private String category;
    private List<String> tags;
}
