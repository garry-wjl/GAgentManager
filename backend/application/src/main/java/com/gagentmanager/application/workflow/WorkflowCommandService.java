package com.gagentmanager.application.workflow;

import com.gagentmanager.client.workflow.CreateWorkflowParam;
import com.gagentmanager.client.workflow.UpdateWorkflowParam;
import com.gagentmanager.client.workflow.WorkflowVO;
import com.gagentmanager.domain.workflow.Workflow;
import com.gagentmanager.domain.workflow.WorkflowRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

/** 工作流写操作服务，负责工作流的创建/更新/删除/发布/下线 */
@Service
public class WorkflowCommandService {

    private final WorkflowRepository workflowRepository;

    public WorkflowCommandService(WorkflowRepository workflowRepository) {
        this.workflowRepository = workflowRepository;
    }

    public WorkflowVO createWorkflow(CreateWorkflowParam param, Long operatorId) {
        Workflow existing = workflowRepository.findByCode(param.getWorkflowCode());
        if (existing != null) {
            throw new BusinessException(ErrorCode.WORKFLOW_CODE_ALREADY_EXISTS);
        }
        Workflow workflow = new Workflow();
        BeanUtils.copyProperties(param, workflow);
        workflow.save(operatorId);
        workflowRepository.save(workflow, operatorId);
        return toVO(workflow);
    }

    public void updateWorkflow(UpdateWorkflowParam param, Long operatorId) {
        Workflow workflow = workflowRepository.findById(param.getId());
        if (workflow == null) {
            throw new BusinessException(ErrorCode.WORKFLOW_NOT_FOUND);
        }
        BeanUtils.copyProperties(param, workflow, "id", "workflowCode");
        workflow.setUpdateNo(String.valueOf(operatorId));
        workflowRepository.save(workflow, operatorId);
    }

    public void deleteWorkflow(String num, Long operatorId) {
        Workflow workflow = workflowRepository.findByNum(num);
        if (workflow == null) {
            throw new BusinessException(ErrorCode.WORKFLOW_NOT_FOUND);
        }
        workflow.delete(operatorId);
        workflowRepository.delete(num, operatorId);
    }

    public void publishWorkflow(String num, Long operatorId) {
        Workflow workflow = workflowRepository.findByNum(num);
        if (workflow == null) {
            throw new BusinessException(ErrorCode.WORKFLOW_NOT_FOUND);
        }
        workflow.publish(operatorId);
        workflowRepository.save(workflow, operatorId);
    }

    public void offlineWorkflow(String num, Long operatorId) {
        Workflow workflow = workflowRepository.findByNum(num);
        if (workflow == null) {
            throw new BusinessException(ErrorCode.WORKFLOW_NOT_FOUND);
        }
        workflow.offline(operatorId);
        workflowRepository.save(workflow, operatorId);
    }

    private WorkflowVO toVO(Workflow w) {
        WorkflowVO vo = new WorkflowVO();
        BeanUtils.copyProperties(w, vo);
        return vo;
    }
}
