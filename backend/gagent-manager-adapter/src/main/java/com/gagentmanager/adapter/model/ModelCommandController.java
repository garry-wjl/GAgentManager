package com.gagentmanager.adapter.model;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.model.ModelCommandService;
import com.gagentmanager.application.model.ModelQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.model.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** 模型管理端 REST 接口，处理模型的增删改查/启停/连通性测试请求 */
@RestController
@RequestMapping("/api/admin/models")
public class ModelCommandController extends BaseController {

    private final ModelCommandService modelCommandService;
    private final ModelQueryService modelQueryService;

    public ModelCommandController(ModelCommandService modelCommandService, ModelQueryService modelQueryService) {
        this.modelCommandService = modelCommandService;
        this.modelQueryService = modelQueryService;
    }

    @PostMapping("/create")
    public Result<ModelVO> createModel(@Valid @RequestBody CreateModelParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        return success(modelCommandService.createModel(param, operatorId));
    }

    @PostMapping("/update")
    public Result<Void> updateModel(@Valid @RequestBody UpdateModelParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        modelCommandService.updateModel(param, operatorId);
        return success();
    }

    @PostMapping("/delete")
    public Result<Void> deleteModel(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        modelCommandService.deleteModel(num, operatorId);
        return success();
    }

    @PostMapping("/enable")
    public Result<Void> enableModel(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        modelCommandService.enableModel(num, operatorId);
        return success();
    }

    @PostMapping("/disable")
    public Result<Void> disableModel(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        modelCommandService.disableModel(num, operatorId);
        return success();
    }

    @PostMapping("/test")
    public Result<TestResultVO> testConnectivity(@RequestParam String num) {
        return success(modelCommandService.testConnectivity(num));
    }

    @GetMapping("/get")
    public Result<ModelVO> get(@RequestParam Long id) {
        return success(modelQueryService.getModelById(id));
    }

    @GetMapping("/detail")
    public Result<ModelVO> detail(@RequestParam String num) {
        return success(modelQueryService.getModelByNum(num));
    }

    @GetMapping("/list")
    public Result<PageResult<ModelVO>> list(PageParam pageParam, String keyword, String provider, String status) {
        IPage<ModelVO> page = modelQueryService.listModels(pageParam, keyword, provider, status);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }
}
