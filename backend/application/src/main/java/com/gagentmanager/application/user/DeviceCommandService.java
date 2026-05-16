package com.gagentmanager.application.user;

import com.gagentmanager.domain.user.UserDevice;
import com.gagentmanager.domain.user.UserDeviceRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.stereotype.Service;

/** 设备命令服务 */
@Service
public class DeviceCommandService {

    private final UserDeviceRepository userDeviceRepository;

    public DeviceCommandService(UserDeviceRepository userDeviceRepository) {
        this.userDeviceRepository = userDeviceRepository;
    }

    public void kickOutDevice(String deviceNum, Long userId) {
        UserDevice device = userDeviceRepository.findByNum(deviceNum);
        if (device == null) {
            throw new BusinessException(ErrorCode.DEVICE_NOT_FOUND);
        }
        device.assertOwnership(userId);
        userDeviceRepository.kickOut(deviceNum, userId);
    }
}
