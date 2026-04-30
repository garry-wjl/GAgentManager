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
import java.util.stream.Collectors;

/** MCP 查询服务，提供 MCP 列表/详情/版本/模板/日志查询 */
@Service
public class McpQueryService {

    private final McpRepository mcpRepository;
    private final McpVersionRepository mcpVersionRepository;
    private final McpTemplateRepository mcpTemplateRepository;
    private final McpLogRepository mcpLogRepository;

    public McpQueryService(McpRepository mcpRepository, McpVersionRepository mcpVersionRepository,
                           McpTemplateRepository mcpTemplateRepository, McpLogRepository mcpLogRepository) {
        this.mcpRepository = mcpRepository;
        this.mcpVersionRepository = mcpVersionRepository;
        this.mcpTemplateRepository = mcpTemplateRepository;
        this.mcpLogRepository = mcpLogRepository;
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

    public List<McpVersionVO> listVersions(Long mcpId) {
        List<McpVersion> versions = mcpVersionRepository.findByMcpId(mcpId);
        return versions.stream().map(this::toVersionVO).collect(Collectors.toList());
    }

    public List<McpTemplateVO> listTemplates(String category) {
        List<McpTemplate> templates = category != null
                ? mcpTemplateRepository.findByCategory(category)
                : mcpTemplateRepository.findAll();
        return templates.stream().map(this::toTemplateVO).collect(Collectors.toList());
    }

    public IPage<McpLogVO> listLogs(PageParam pageParam, Long mcpId, String logLevel) {
        Page<McpLog> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<McpLog> logPage = mcpLogRepository.findByMcpId(page, mcpId, logLevel);
        return logPage.convert(this::toLogVO);
    }

    private McpVO toMcpVO(McpService m) {
        McpVO vo = new McpVO();
        BeanUtils.copyProperties(m, vo);
        return vo;
    }

    private McpVersionVO toVersionVO(McpVersion v) {
        McpVersionVO vo = new McpVersionVO();
        vo.setNum(v.getNum());
        vo.setVersion(v.getVersion());
        vo.setVersionTag(v.getVersionTag());
        vo.setChangelog(v.getChangelog());
        vo.setConfigSnapshot(v.getConfigSnapshot());
        vo.setCreator(v.getCreator());
        vo.setPublishTime(v.getPublishTime());
        vo.setCreateTime(v.getCreateTime());
        vo.setIsCurrent(v.getIsCurrent());
        return vo;
    }

    private McpTemplateVO toTemplateVO(McpTemplate t) {
        McpTemplateVO vo = new McpTemplateVO();
        vo.setNum(t.getNum());
        vo.setTemplateName(t.getTemplateName());
        vo.setDescription(t.getDescription());
        vo.setConfigPreset(t.getConfigPreset());
        vo.setCategory(t.getCategory());
        vo.setIsOfficial(t.getIsOfficial());
        vo.setUseCount(t.getUseCount());
        vo.setCreateTime(t.getCreateTime());
        return vo;
    }

    private McpLogVO toLogVO(McpLog l) {
        McpLogVO vo = new McpLogVO();
        vo.setId(l.getId());
        vo.setMcpId(l.getMcpId());
        vo.setLogLevel(l.getLogLevel());
        vo.setMessage(l.getMessage());
        vo.setRequestUrl(l.getRequestUrl());
        vo.setStatusCode(l.getStatusCode());
        vo.setResponseTime(l.getResponseTime());
        vo.setErrorCode(l.getErrorCode());
        vo.setCreateTime(l.getCreateTime());
        return vo;
    }
}
