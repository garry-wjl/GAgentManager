package com.gagentmanager.domain.user;

import java.util.List;

/** 登录设备仓储接口 */
public interface UserDeviceRepository {
    UserDevice findByNum(String num);
    List<UserDevice> listByUserId(Long userId);
    void save(UserDevice device, Long operatorId);
    void kickOut(String num, Long operatorId);
}
