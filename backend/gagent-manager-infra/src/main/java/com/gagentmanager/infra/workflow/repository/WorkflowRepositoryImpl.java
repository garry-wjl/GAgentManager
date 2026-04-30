package com.gagentmanager.infra.workflow.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.workflow.Workflow;
import com.gagentmanager.domain.workflow.WorkflowRepository;
import com.gagentmanager.infra.workflow.entity.WorkflowEntity;
import com.gagentmanager.infra.workflow.mapper.WorkflowMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

/** 工作流仓储实现 */
@Repository
public class WorkflowRepositoryImpl implements WorkflowRepository {
    private final WorkflowMapper mapper;
    public WorkflowRepositoryImpl(WorkflowMapper mapper) { this.mapper = mapper; }

    @Override
    public Workflow findById(Long id) { WorkflowEntity e = mapper.selectById(id); return e != null ? toDomain(e) : null; }

    @Override
    public Workflow findByNum(String num) {
        LambdaQueryWrapper<WorkflowEntity> qw = new LambdaQueryWrapper<WorkflowEntity>()
                .eq(WorkflowEntity::getNum, num).eq(WorkflowEntity::getDeleted, false);
        WorkflowEntity e = mapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public Workflow findByCode(String workflowCode) {
        LambdaQueryWrapper<WorkflowEntity> qw = new LambdaQueryWrapper<WorkflowEntity>()
                .eq(WorkflowEntity::getWorkflowCode, workflowCode).eq(WorkflowEntity::getDeleted, false);
        WorkflowEntity e = mapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public IPage<Workflow> list(IPage<Workflow> page, String keyword, String status) {
        Page<WorkflowEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<WorkflowEntity> qw = new LambdaQueryWrapper<WorkflowEntity>().eq(WorkflowEntity::getDeleted, false);
        if (StringUtils.hasText(keyword)) qw.like(WorkflowEntity::getWorkflowName, keyword);
        if (StringUtils.hasText(status)) qw.eq(WorkflowEntity::getStatus, status);
        qw.orderByDesc(WorkflowEntity::getCreateTime);
        IPage<WorkflowEntity> result = mapper.selectPage(mpPage, qw);
        return convertPage(result);
    }

    @Override
    public void save(Workflow workflow, Long operatorId) {
        workflow.save(operatorId);
        WorkflowEntity e = toEntity(workflow);
        if (workflow.getId() == null) { mapper.insert(e); workflow.setId(e.getId()); }
        else { mapper.updateById(e); }
    }

    @Override
    public void delete(String num, Long operatorId) {
        Workflow workflow = findByNum(num);
        if (workflow != null) { workflow.delete(operatorId); mapper.updateById(toEntity(workflow)); }
    }

    private Workflow toDomain(WorkflowEntity e) { Workflow d = new Workflow(); BeanUtils.copyProperties(e, d); return d; }
    private WorkflowEntity toEntity(Workflow d) { WorkflowEntity e = new WorkflowEntity(); BeanUtils.copyProperties(d, e); return e; }
    private IPage<Workflow> convertPage(IPage<WorkflowEntity> s) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<Workflow> t =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(s.getCurrent(), s.getSize(), s.getTotal());
        t.setRecords(s.getRecords().stream().map(this::toDomain).toList());
        return t;
    }
}
