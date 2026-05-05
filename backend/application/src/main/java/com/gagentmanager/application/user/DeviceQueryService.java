package com.gagentmanager.application.user;

import com.gagentmanager.client.device.UserDeviceVO;
import com.gagentmanager.domain.user.UserDevice;
import com.gagentmanager.domain.user.UserDeviceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/** 设备查询服务 */
@Service
public class DeviceQueryService {

    private final UserDeviceRepository userDeviceRepository;

    public DeviceQueryService(UserDeviceRepository userDeviceRepository) {
        this.userDeviceRepository = userDeviceRepository;
    }

    public List<UserDeviceVO> listUserDevices(Long userId) {
        List<UserDevice> devices = userDeviceRepository.listByUserId(userId);
        return devices.stream().map(this::toVO).collect(Collectors.toList());
    }

    private UserDeviceVO toVO(UserDevice d) {
        UserDeviceVO vo = new UserDeviceVO();
        vo.setNum(d.getNum());
        vo.setDeviceName(d.getDeviceName());
        vo.setIpAddress(d.getIpAddress());
        vo.setLoginTime(d.getLoginTime());
        vo.setLastActiveTime(d.getLastActiveTime());
        vo.setIsOnline(d.getIsOnline());
        return vo;
    }
}
