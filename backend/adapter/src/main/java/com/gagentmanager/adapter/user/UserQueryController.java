package com.gagentmanager.adapter.user;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.user.UserProfileService;
import com.gagentmanager.application.user.UserQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.user.*;
import com.gagentmanager.client.user.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

/** 用户管理端 Query REST 接口，处理用户的查询请求 */
@RestController
@RequestMapping("/api/user/query")
public class UserQueryController extends BaseController {

    private final UserQueryService userQueryService;
    private final UserProfileService userProfileService;

    public UserQueryController(UserQueryService userQueryService, UserProfileService userProfileService) {
        this.userQueryService = userQueryService;
        this.userProfileService = userProfileService;
    }

    @GetMapping("/get")
    public Result<UserVO> get(@RequestParam Long id) {
        return success(userQueryService.getUserById(id));
    }

    @GetMapping("/detail")
    public Result<UserVO> detail(@RequestParam String num) {
        return success(userQueryService.getUserByNum(num));
    }

    @GetMapping("/list")
    public Result<PageResult<UserVO>> list(PageParam pageParam, String keyword, String status) {
        IPage<UserVO> page = userQueryService.listUsers(pageParam, keyword, status);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }

    @GetMapping("/profile")
    public Result<UserProfileVO> getProfile(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return success(userProfileService.getProfile(userId));
    }
}
