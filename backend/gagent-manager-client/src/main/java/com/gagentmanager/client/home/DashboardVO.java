package com.gagentmanager.client.home;

import lombok.Data;

import java.util.List;

/** 首页仪表盘视图对象，包含统计数据、快捷方式和公告列表 */
@Data
public class DashboardVO {
    private Integer agentTotal;
    private Integer onlineAgents;
    private Integer activeUsers;
    private Integer unreadNotices;
    private Integer modelTotal;
    private Integer skillTotal;
    private Integer mcpTotal;
    private List<ShortcutVO> shortcuts;
    private List<NoticeVO> notices;
}
