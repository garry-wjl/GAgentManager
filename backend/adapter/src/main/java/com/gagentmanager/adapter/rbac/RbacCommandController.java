package com.gagentmanager.adapter.rbac;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.rbac.RbacCommandService;
import com.gagentmanager.client.rbac.*;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** RBAC 管理端 Command REST 接口，处理角色/权限/用户角色分配的写操作请求 */
@RestController
@RequestMapping("/api/rbac/command")
public class RbacCommandController extends BaseController {

    private final RbacCommandService rbacCommandService;

    public RbacCommandController(RbacCommandService rbacCommandService) {
        this.rbacCommandService = rbacCommandService;
    }

    @PostMapping("/role/create")
    public Result<RoleVO> createRole(@Valid @RequestBody CreateRoleParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        return success(rbacCommandService.createRole(param, operatorId));
    }

    @PostMapping("/role/update")
    public Result<Void> updateRole(@Valid @RequestBody UpdateRoleParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        rbacCommandService.updateRole(param, operatorId);
        return success();
    }

    @PostMapping("/role/delete")
    public Result<Void> deleteRole(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        rbacCommandService.deleteRole(num, operatorId);
        return success();
    }

    @PostMapping("/role/enable")
    public Result<Void> enableRole(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        rbacCommandService.enableRole(num, operatorId);
        return success();
    }

    @PostMapping("/role/disable")
    public Result<Void> disableRole(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        rbacCommandService.disableRole(num, operatorId);
        return success();
    }

    @PostMapping("/role/assign-users")
    public Result<Void> assignUsers(@Valid @RequestBody AssignUsersParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        rbacCommandService.assignUsers(param, operatorId);
        return success();
    }

    @PostMapping("/role/remove-user")
    public Result<Void> removeUser(@RequestParam Long userId, @RequestParam Long roleId, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        rbacCommandService.removeUserFromRole(userId, roleId, operatorId);
        return success();
    }

    @PostMapping("/role/assign-permissions")
    public Result<Void> assignPermissions(@Valid @RequestBody AssignPermissionsParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        rbacCommandService.assignPermissions(param, operatorId);
        return success();
    }
}
