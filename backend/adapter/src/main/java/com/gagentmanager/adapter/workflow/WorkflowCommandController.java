package com.gagentmanager.adapter.workflow;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.workflow.WorkflowCommandService;
import com.gagentmanager.client.workflow.*;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** 工作流管理端 Command REST 接口，处理工作流的增删改/发布/下线等写操作请求 */
@RestController
@RequestMapping("/api/workflow/command")
public class WorkflowCommandController extends BaseController {

    private final WorkflowCommandService workflowCommandService;

    public WorkflowCommandController(WorkflowCommandService workflowCommandService) {
        this.workflowCommandService = workflowCommandService;
    }

    @PostMapping("/create")
    public Result<WorkflowVO> createWorkflow(@Valid @RequestBody CreateWorkflowParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        return success(workflowCommandService.createWorkflow(param, operatorId));
    }

    @PostMapping("/update")
    public Result<Void> updateWorkflow(@Valid @RequestBody UpdateWorkflowParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        workflowCommandService.updateWorkflow(param, operatorId);
        return success();
    }

    @PostMapping("/delete")
    public Result<Void> deleteWorkflow(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        workflowCommandService.deleteWorkflow(num, operatorId);
        return success();
    }

    @PostMapping("/publish")
    public Result<Void> publishWorkflow(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        workflowCommandService.publishWorkflow(num, operatorId);
        return success();
    }

    @PostMapping("/offline")
    public Result<Void> offlineWorkflow(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        workflowCommandService.offlineWorkflow(num, operatorId);
        return success();
    }
}
