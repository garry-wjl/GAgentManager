package com.gagentmanager.adapter.system_config;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.system_config.SystemConfigQueryService;
import com.gagentmanager.client.system_config.*;
import com.gagentmanager.facade.common.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** 系统配置管理端 Query REST 接口，处理配置的查询请求 */
@RestController
@RequestMapping("/api/system-config/query")
public class SystemConfigQueryController extends BaseController {

    private final SystemConfigQueryService configQueryService;

    public SystemConfigQueryController(SystemConfigQueryService configQueryService) {
        this.configQueryService = configQueryService;
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
