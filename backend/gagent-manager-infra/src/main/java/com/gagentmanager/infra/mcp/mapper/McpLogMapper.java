package com.gagentmanager.infra.mcp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.mcp.entity.McpLogEntity;
import org.apache.ibatis.annotations.Mapper;

/** MCP 日志数据库 Mapper 接口 */
@Mapper
public interface McpLogMapper extends BaseMapper<McpLogEntity> {}
