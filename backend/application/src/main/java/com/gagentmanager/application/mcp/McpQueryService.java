package com.gagentmanager.application.mcp;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.mcp.*;
import com.gagentmanager.domain.mcp.*;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;

/** MCP 查询服务，提供 MCP 列表/详情/工具列表 */
@Service
public class McpQueryService {

    private final McpRepository mcpRepository;
    private final McpClientGateway mcpClientGateway;

    public McpQueryService(McpRepository mcpRepository, McpClientGateway mcpClientGateway) {
        this.mcpRepository = mcpRepository;
        this.mcpClientGateway = mcpClientGateway;
    }

    public McpVO getMcpById(Long id) {
        McpService mcp = mcpRepository.findById(id);
        if (mcp == null) {
            throw new BusinessException(ErrorCode.MCP_NOT_FOUND);
        }
        return toMcpVO(mcp);
    }

    public McpVO getMcpByNum(String num) {
        McpService mcp = mcpRepository.findByNum(num);
        if (mcp == null) {
            throw new BusinessException(ErrorCode.MCP_NOT_FOUND);
        }
        return toMcpVO(mcp);
    }

    public IPage<McpVO> listMcps(PageParam pageParam, String keyword, String status) {
        Page<McpService> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<McpService> mcpPage = mcpRepository.list(page, keyword, status);
        return mcpPage.convert(this::toMcpVO);
    }

    public List<ToolVO> listTools(String num) {
        McpService mcp = mcpRepository.findByNum(num);
        if (mcp == null) {
            throw new BusinessException(ErrorCode.MCP_NOT_FOUND);
        }
        return mcpClientGateway.fetchTools(mcp);
    }

    private McpVO toMcpVO(McpService m) {
        McpVO vo = new McpVO();
        BeanUtils.copyProperties(m, vo);
        return vo;
    }
}
