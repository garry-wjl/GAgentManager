package com.gagentmanager.infra.mcp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.mcp.entity.McpServiceEntity;
import org.apache.ibatis.annotations.Mapper;

/** MCP 服务数据库 Mapper 接口 */
@Mapper
public interface McpServiceMapper extends BaseMapper<McpServiceEntity> {}
