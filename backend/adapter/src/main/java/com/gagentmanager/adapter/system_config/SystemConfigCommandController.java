package com.gagentmanager.adapter.system_config;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.system_config.SystemConfigCommandService;
import com.gagentmanager.client.system_config.*;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** 系统配置管理端 Command REST 接口，处理配置的更新等写操作请求 */
@RestController
@RequestMapping("/api/system-config/command")
public class SystemConfigCommandController extends BaseController {

    private final SystemConfigCommandService configCommandService;

    public SystemConfigCommandController(SystemConfigCommandService configCommandService) {
        this.configCommandService = configCommandService;
    }

    @PostMapping("/update")
    public Result<Void> updateConfig(@Valid @RequestBody UpdateConfigParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        configCommandService.updateConfig(param, operatorId);
        return success();
    }

    @PostMapping("/batch-update")
    public Result<Void> batchUpdate(@Valid @RequestBody BatchUpdateConfigParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        configCommandService.batchUpdateConfig(param, operatorId);
        return success();
    }
}
