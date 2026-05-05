package com.gagentmanager.client.device;

import lombok.Data;

import java.util.Date;

/** 登录设备视图对象 */
@Data
public class UserDeviceVO {
    private String num;
    private String deviceName;
    private String ipAddress;
    private Date loginTime;
    private Date lastActiveTime;
    private Boolean isOnline;
}
