package com.gagentmanager.infra.mcp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.mcp.entity.McpVersionEntity;
import org.apache.ibatis.annotations.Mapper;

/** MCP 版本数据库 Mapper 接口 */
@Mapper
public interface McpVersionMapper extends BaseMapper<McpVersionEntity> {}
