package com.gagentmanager.adapter.workflow;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.workflow.WorkflowCommandService;
import com.gagentmanager.application.workflow.WorkflowQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.workflow.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** 工作流管理端 REST 接口，处理工作流的增删改查/发布/下线请求 */
@RestController
@RequestMapping("/api/admin/workflows")
public class WorkflowCommandController extends BaseController {

    private final WorkflowCommandService workflowCommandService;
    private final WorkflowQueryService workflowQueryService;

    public WorkflowCommandController(WorkflowCommandService workflowCommandService, WorkflowQueryService workflowQueryService) {
        this.workflowCommandService = workflowCommandService;
        this.workflowQueryService = workflowQueryService;
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

    @GetMapping("/get")
    public Result<WorkflowVO> get(@RequestParam Long id) {
        return success(workflowQueryService.getWorkflowById(id));
    }

    @GetMapping("/detail")
    public Result<WorkflowVO> detail(@RequestParam String num) {
        return success(workflowQueryService.getWorkflowByNum(num));
    }

    @GetMapping("/list")
    public Result<PageResult<WorkflowVO>> list(PageParam pageParam, String keyword, String status) {
        IPage<WorkflowVO> page = workflowQueryService.listWorkflows(pageParam, keyword, status);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }
}
