package com.gagentmanager.adapter.home;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.home.HomeQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.home.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 首页 REST 接口，提供仪表盘统计数据、公告列表和全局搜索 */
@RestController
@RequestMapping("/api/home")
public class HomeQueryController extends BaseController {

    private final HomeQueryService homeQueryService;

    public HomeQueryController(HomeQueryService homeQueryService) {
        this.homeQueryService = homeQueryService;
    }

    @GetMapping("/dashboard")
    public Result<DashboardVO> dashboard() {
        return success(homeQueryService.getDashboard());
    }

    @GetMapping("/notices")
    public Result<PageResult<NoticeVO>> notices(PageParam pageParam, String type) {
        IPage<NoticeVO> page = homeQueryService.listNotices(pageParam, type);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }

    @GetMapping("/search")
    public Result<SearchResultVO> search(@RequestParam String keyword) {
        return success(homeQueryService.search(keyword));
    }
}
