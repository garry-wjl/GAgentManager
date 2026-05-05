package com.gagentmanager.client.user;

import lombok.Data;

/** 用户偏好设置参数，包含语言和主题 */
@Data
public class PreferenceParam {
    private String language;
    private String theme;
}
