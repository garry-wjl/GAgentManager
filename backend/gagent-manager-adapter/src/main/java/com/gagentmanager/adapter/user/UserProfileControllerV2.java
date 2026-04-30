package com.gagentmanager.adapter.user;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.user.UserProfileService;
import com.gagentmanager.client.user.*;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** 用户个人中心 REST 接口，处理个人资料修改/密码修改/头像更新/MFA 开关请求 */
@RestController
@RequestMapping("/api/user")
public class UserProfileControllerV2 extends BaseController {

    private final UserProfileService userProfileService;

    public UserProfileControllerV2(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/profile")
    public Result<UserProfileVO> getProfile(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return success(userProfileService.getProfile(userId));
    }

    @PostMapping("/profile/update")
    public Result<Void> updateProfile(@Valid @RequestBody UpdateProfileParam param, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        userProfileService.updateProfile(userId, param);
        return success();
    }

    @PostMapping("/password/change")
    public Result<Void> changePassword(@Valid @RequestBody PasswordChangeParam param, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        userProfileService.changePassword(userId, param);
        return success();
    }

    @PostMapping("/avatar/update")
    public Result<Void> updateAvatar(@RequestParam String avatarUrl, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        userProfileService.updateAvatar(userId, avatarUrl);
        return success();
    }

    @PostMapping("/mfa/toggle")
    public Result<Void> toggleMfa(@RequestParam Boolean enabled, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        userProfileService.toggleMfa(userId, enabled);
        return success();
    }
}
