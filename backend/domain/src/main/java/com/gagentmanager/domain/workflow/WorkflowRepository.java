package com.gagentmanager.domain.workflow;

import com.baomidou.mybatisplus.core.metadata.IPage;

/** 工作流仓储接口 */
public interface WorkflowRepository {
    Workflow findById(Long id);
    Workflow findByNum(String num);
    Workflow findByCode(String workflowCode);
    IPage<Workflow> list(IPage<Workflow> page, String keyword, String status);
    void save(Workflow workflow, Long operatorId);
    void delete(String num, Long operatorId);
}
