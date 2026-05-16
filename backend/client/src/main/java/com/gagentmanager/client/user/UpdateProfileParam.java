package com.gagentmanager.client.user;

import lombok.Data;

@Data
public class UpdateProfileParam {
    private String realName;
    private String phone;
    private String email;
}
