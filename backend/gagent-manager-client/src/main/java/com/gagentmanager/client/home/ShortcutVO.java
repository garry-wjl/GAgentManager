package com.gagentmanager.client.home;

import lombok.Data;

/** 首页快捷方式视图对象 */
@Data
public class ShortcutVO {
    private String name;
    private String link;
    private String icon;
    private String description;
}
