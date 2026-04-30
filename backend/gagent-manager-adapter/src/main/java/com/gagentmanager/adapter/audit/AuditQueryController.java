package com.gagentmanager.adapter.audit;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.audit.AuditQueryService;
import com.gagentmanager.client.audit.AuditLogVO;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 审计日志查询 REST 接口，提供审计日志分页查询 */
@RestController
@RequestMapping("/api/admin/audit")
public class AuditQueryController extends BaseController {

    private final AuditQueryService auditQueryService;

    public AuditQueryController(AuditQueryService auditQueryService) {
        this.auditQueryService = auditQueryService;
    }

    @GetMapping("/logs")
    public Result<PageResult<AuditLogVO>> logs(PageParam pageParam,
                                                @RequestParam(required = false) Long operatorId,
                                                @RequestParam(required = false) String resourceType,
                                                @RequestParam(required = false) String action,
                                                @RequestParam(required = false) String startTime,
                                                @RequestParam(required = false) String endTime) {
        IPage<AuditLogVO> page = auditQueryService.listAuditLogs(pageParam, operatorId, resourceType, action, startTime, endTime);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }
}
