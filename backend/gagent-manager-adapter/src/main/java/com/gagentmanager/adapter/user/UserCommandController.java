package com.gagentmanager.adapter.user;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.user.UserCommandService;
import com.gagentmanager.application.user.UserQueryService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.user.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** 用户管理端 REST 接口，处理用户的增删改查/激活/停用/密码重置请求 */
@RestController
@RequestMapping("/api/admin/users")
public class UserCommandController extends BaseController {

    private final UserCommandService userCommandService;
    private final UserQueryService userQueryService;

    public UserCommandController(UserCommandService userCommandService, UserQueryService userQueryService) {
        this.userCommandService = userCommandService;
        this.userQueryService = userQueryService;
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
    public Result<Void> batchCreate(@RequestBody java.util.List<CreateUserParam> params, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        userCommandService.batchCreateUsers(params, operatorId);
        return success();
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
}
