package com.gagentmanager.application.mcp;

import com.gagentmanager.client.mcp.*;
import com.gagentmanager.domain.mcp.*;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

/** MCP 写操作服务，负责 MCP 服务的创建/更新/删除/启停/连通性测试 */
@Service
public class McpCommandService {

    private final McpRepository mcpRepository;
    private final McpClientGateway mcpClientGateway;

    public McpCommandService(McpRepository mcpRepository, McpClientGateway mcpClientGateway) {
        this.mcpRepository = mcpRepository;
        this.mcpClientGateway = mcpClientGateway;
    }

    public McpVO createMcp(CreateMcpParam param, Long operatorId) {
        McpService existing = mcpRepository.findByCode(param.getMcpName());
        if (existing != null) {
            throw new BusinessException(ErrorCode.MCP_NAME_ALREADY_EXISTS);
        }
        McpService mcp = new McpService();
        BeanUtils.copyProperties(param, mcp);
        mcp.save(operatorId);
        mcpRepository.save(mcp, operatorId);
        return toMcpVO(mcp);
    }

    public void updateMcp(UpdateMcpParam param, Long operatorId) {
        McpService mcp = mcpRepository.findByNum(param.getNum());
        if (mcp == null) {
            throw new BusinessException(ErrorCode.MCP_NOT_FOUND);
        }
        BeanUtils.copyProperties(param, mcp, "num");
        mcp.setUpdateNo(String.valueOf(operatorId));
        mcpRepository.save(mcp, operatorId);
    }

    public void deleteMcp(String num, Long operatorId) {
        McpService mcp = mcpRepository.findByNum(num);
        if (mcp == null) {
            throw new BusinessException(ErrorCode.MCP_NOT_FOUND);
        }
        mcp.delete(operatorId);
        mcpRepository.delete(num, operatorId);
    }

    public void enableMcp(String num, Long operatorId) {
        McpService mcp = mcpRepository.findByNum(num);
        if (mcp == null) {
            throw new BusinessException(ErrorCode.MCP_NOT_FOUND);
        }
        mcp.enable(operatorId);
        mcpRepository.save(mcp, operatorId);
    }

    public void disableMcp(String num, Long operatorId) {
        McpService mcp = mcpRepository.findByNum(num);
        if (mcp == null) {
            throw new BusinessException(ErrorCode.MCP_NOT_FOUND);
        }
        mcp.disable(operatorId);
        mcpRepository.save(mcp, operatorId);
    }

    public TestResult testMcp(String num) {
        McpService mcp = mcpRepository.findByNum(num);
        if (mcp == null) {
            throw new BusinessException(ErrorCode.MCP_NOT_FOUND);
        }
        McpClientGateway.TestResult result = mcpClientGateway.testConnectivity(mcp);
        mcpRepository.save(mcp, mcp.getId());
        return new TestResult(result.isSuccess(), result.getResponseTime(), result.getErrorMessage());
    }

    private McpVO toMcpVO(McpService m) {
        McpVO vo = new McpVO();
        BeanUtils.copyProperties(m, vo);
        return vo;
    }
}
