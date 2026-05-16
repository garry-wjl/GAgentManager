package com.gagentmanager.adapter.user;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.user.DeviceCommandService;
import com.gagentmanager.application.user.DeviceQueryService;
import com.gagentmanager.client.device.KickOutDeviceParam;
import com.gagentmanager.client.device.UserDeviceVO;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 设备管理控制器 */
@RestController
@RequestMapping("/api/device")
public class DeviceController extends BaseController {

    private final DeviceQueryService deviceQueryService;
    private final DeviceCommandService deviceCommandService;

    public DeviceController(DeviceQueryService deviceQueryService, DeviceCommandService deviceCommandService) {
        this.deviceQueryService = deviceQueryService;
        this.deviceCommandService = deviceCommandService;
    }

    @GetMapping("/list")
    public Result<List<UserDeviceVO>> listDevices(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return success(deviceQueryService.listUserDevices(userId));
    }

    @PostMapping("/kick-out")
    public Result<Void> kickOutDevice(@Valid @RequestBody KickOutDeviceParam param, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        deviceCommandService.kickOutDevice(param.getDeviceNum(), userId);
        return success();
    }
}
