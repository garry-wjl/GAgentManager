package com.gagentmanager.application.workflow;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.workflow.WorkflowVO;
import com.gagentmanager.domain.workflow.Workflow;
import com.gagentmanager.domain.workflow.WorkflowRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

/** 工作流查询服务，提供工作流列表/详情查询 */
@Service
public class WorkflowQueryService {

    private final WorkflowRepository workflowRepository;

    public WorkflowQueryService(WorkflowRepository workflowRepository) {
        this.workflowRepository = workflowRepository;
    }

    public WorkflowVO getWorkflowById(Long id) {
        Workflow workflow = workflowRepository.findById(id);
        if (workflow == null) {
            throw new BusinessException(ErrorCode.WORKFLOW_NOT_FOUND);
        }
        return toVO(workflow);
    }

    public WorkflowVO getWorkflowByNum(String num) {
        Workflow workflow = workflowRepository.findByNum(num);
        if (workflow == null) {
            throw new BusinessException(ErrorCode.WORKFLOW_NOT_FOUND);
        }
        return toVO(workflow);
    }

    public IPage<WorkflowVO> listWorkflows(PageParam pageParam, String keyword, String status) {
        Page<Workflow> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<Workflow> wfPage = workflowRepository.list(page, keyword, status);
        return wfPage.convert(this::toVO);
    }

    private WorkflowVO toVO(Workflow w) {
        WorkflowVO vo = new WorkflowVO();
        BeanUtils.copyProperties(w, vo);
        return vo;
    }
}
