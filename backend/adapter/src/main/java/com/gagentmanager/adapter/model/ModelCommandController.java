package com.gagentmanager.adapter.model;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.model.ModelCommandService;
import com.gagentmanager.client.model.*;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** 模型管理端 Command REST 接口，处理模型的增删改/启停/连通性测试等写操作请求 */
@RestController
@RequestMapping("/api/model/command")
public class ModelCommandController extends BaseController {

    private final ModelCommandService modelCommandService;

    public ModelCommandController(ModelCommandService modelCommandService) {
        this.modelCommandService = modelCommandService;
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
}
