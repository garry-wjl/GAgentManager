package com.gagentmanager.adapter.system_config;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.system_config.SystemConfigCommandService;
import com.gagentmanager.application.system_config.SystemConfigQueryService;
import com.gagentmanager.client.system_config.*;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** 系统配置管理端 REST 接口，处理配置的查询和更新请求 */
@RestController
@RequestMapping("/api/admin/configs")
public class SystemConfigCommandController extends BaseController {

    private final SystemConfigCommandService configCommandService;
    private final SystemConfigQueryService configQueryService;

    public SystemConfigCommandController(SystemConfigCommandService configCommandService, SystemConfigQueryService configQueryService) {
        this.configCommandService = configCommandService;
        this.configQueryService = configQueryService;
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

    @GetMapping("/list")
    public Result<List<SystemConfigVO>> list() {
        return success(configQueryService.listConfigs());
    }

    @GetMapping("/public")
    public Result<List<SystemConfigVO>> publicConfigs() {
        return success(configQueryService.listPublicConfigs());
    }

    @GetMapping("/all-as-map")
    public Result<Map<String, String>> allAsMap() {
        return success(configQueryService.listAllAsMap());
    }
}
