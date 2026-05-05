package com.gagentmanager.adapter.user;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.user.UserCommandService;
import com.gagentmanager.application.user.UserProfileService;
import com.gagentmanager.client.user.*;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 用户管理端 Command REST 接口，处理用户的增删改/激活/停用/密码重置等写操作请求 */
@RestController
@RequestMapping("/api/user/command")
public class UserCommandController extends BaseController {

    private final UserCommandService userCommandService;
    private final UserProfileService userProfileService;

    public UserCommandController(UserCommandService userCommandService, UserProfileService userProfileService) {
        this.userCommandService = userCommandService;
        this.userProfileService = userProfileService;
    }

    @PostMapping("/create")
    public Result<UserVO> createUser(@Valid @RequestBody CreateUserParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        return success(userCommandService.createUser(param, operatorId));
    }

    @PostMapping("/update")
    public Result<Void> updateUser(@Valid @RequestBody UpdateUserParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        userCommandService.updateUser(param.getId(), param, operatorId);
        return success();
    }

    @PostMapping("/delete")
    public Result<Void> deleteUser(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        userCommandService.deleteUser(num, operatorId);
        return success();
    }

    @PostMapping("/activate")
    public Result<Void> activateUser(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        userCommandService.activateUser(num, operatorId);
        return success();
    }

    @PostMapping("/deactivate")
    public Result<Void> deactivateUser(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        userCommandService.deactivateUser(num, operatorId);
        return success();
    }

    @PostMapping("/resign")
    public Result<Void> resignUser(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        userCommandService.resignUser(num, operatorId);
        return success();
    }

    @PostMapping("/reset-password")
    public Result<Void> resetPassword(@RequestParam String num, @RequestParam String newPassword, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        userCommandService.resetUserPassword(num, newPassword, operatorId);
        return success();
    }

    @PostMapping("/batch-create")
    public Result<Void> batchCreate(@RequestBody List<CreateUserParam> params, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        userCommandService.batchCreateUsers(params, operatorId);
        return success();
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
