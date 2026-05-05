package com.gagentmanager.infra.workflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.workflow.entity.WorkflowEntity;
import org.apache.ibatis.annotations.Mapper;

/** 工作流数据库 Mapper 接口 */
@Mapper
public interface WorkflowMapper extends BaseMapper<WorkflowEntity> {}
