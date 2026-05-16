package com.gagentmanager.adapter.workflow;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.workflow.WorkflowQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.workflow.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import org.springframework.web.bind.annotation.*;

/** 工作流管理端 Query REST 接口，处理工作流的查询请求 */
@RestController
@RequestMapping("/api/workflow/query")
public class WorkflowQueryController extends BaseController {

    private final WorkflowQueryService workflowQueryService;

    public WorkflowQueryController(WorkflowQueryService workflowQueryService) {
        this.workflowQueryService = workflowQueryService;
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
