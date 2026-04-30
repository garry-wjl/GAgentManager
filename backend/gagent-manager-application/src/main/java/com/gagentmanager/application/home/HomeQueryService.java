package com.gagentmanager.application.home;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.home.*;
import com.gagentmanager.domain.agent.AgentRepository;
import com.gagentmanager.domain.home.Notice;
import com.gagentmanager.domain.home.NoticeRepository;
import com.gagentmanager.domain.mcp.McpRepository;
import com.gagentmanager.domain.model.ModelRepository;
import com.gagentmanager.domain.skill.SkillRepository;
import com.gagentmanager.domain.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/** 首页查询服务，提供仪表盘统计数据和公告列表查询 */
@Service
public class HomeQueryService {

    private final NoticeRepository noticeRepository;
    private final AgentRepository agentRepository;
    private final UserRepository userRepository;
    private final ModelRepository modelRepository;
    private final SkillRepository skillRepository;
    private final McpRepository mcpRepository;

    public HomeQueryService(NoticeRepository noticeRepository, AgentRepository agentRepository,
                            UserRepository userRepository, ModelRepository modelRepository,
                            SkillRepository skillRepository, McpRepository mcpRepository) {
        this.noticeRepository = noticeRepository;
        this.agentRepository = agentRepository;
        this.userRepository = userRepository;
        this.modelRepository = modelRepository;
        this.skillRepository = skillRepository;
        this.mcpRepository = mcpRepository;
    }

    public DashboardVO getDashboard() {
        long agentTotal = agentRepository.count();
        long onlineAgents = agentRepository.countOnline();
        long modelTotal = modelRepository.count();

        DashboardVO vo = new DashboardVO();
        vo.setAgentTotal((int) agentTotal);
        vo.setOnlineAgents((int) onlineAgents);
        vo.setActiveUsers(0);
        vo.setModelTotal((int) modelTotal);
        vo.setSkillTotal(0);
        vo.setMcpTotal(0);
        vo.setNotices(listRecentNotices());
        return vo;
    }

    public IPage<NoticeVO> listNotices(PageParam pageParam, String type) {
        Page<Notice> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<Notice> noticePage = noticeRepository.list(page, type);
        return noticePage.convert(this::toNoticeVO);
    }

    public List<NoticeVO> listRecentNotices() {
        Page<Notice> page = new Page<>(1, 5);
        IPage<Notice> noticePage = noticeRepository.list(page, null);
        return noticePage.getRecords().stream()
                .map(this::toNoticeVO)
                .collect(Collectors.toList());
    }

    public SearchResultVO search(String keyword) {
        SearchResultVO vo = new SearchResultVO();
        vo.setKeyword(keyword);
        return vo;
    }

    private NoticeVO toNoticeVO(Notice n) {
        NoticeVO vo = new NoticeVO();
        vo.setNum(n.getNum());
        vo.setTitle(n.getTitle());
        vo.setContent(n.getContent());
        vo.setType(n.getType());
        vo.setSeverity(n.getSeverity());
        vo.setSender(n.getSender());
        vo.setLink(n.getLink());
        vo.setExpireTime(n.getExpireTime());
        vo.setCreateTime(n.getCreateTime());
        return vo;
    }
}
