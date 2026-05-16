package com.gagentmanager.client.skill;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/** 创建 Skill 参数，需提供编码、名称和分类 */
@Data
public class CreateSkillParam {
    @NotBlank
    private String skillCode;
    @NotBlank
    private String skillName;
    private String description;
    @NotBlank
    private String category;
    private List<String> tags;
    private String author;
    private Boolean isFree;
}
