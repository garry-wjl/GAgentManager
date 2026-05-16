package com.gagentmanager.client.prompt;

import lombok.Data;

/** Prompt 模板视图对象 */
@Data
public class PromptTemplateVO {
    private String num;
    private String title;
    private String content;
    private String category;
    private String icon;
}
