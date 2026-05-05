package com.gagentmanager.client.user;

import lombok.Data;

/** 更新用户参数，管理端编辑用户信息使用 */
@Data
public class UpdateUserParam {
    private Long id;
    private String realName;
    private String nickname;
    private String phone;
    private String email;
    private String department;
    private String notes;
}
