package com.gagentmanager.infra.mcp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.mcp.entity.McpTemplateEntity;
import org.apache.ibatis.annotations.Mapper;

/** MCP 模板数据库 Mapper 接口 */
@Mapper
public interface McpTemplateMapper extends BaseMapper<McpTemplateEntity> {}
