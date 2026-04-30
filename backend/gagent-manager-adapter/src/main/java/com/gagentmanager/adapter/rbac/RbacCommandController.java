package com.gagentmanager.adapter.rbac;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.rbac.RbacCommandService;
import com.gagentmanager.application.rbac.RbacQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.rbac.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** RBAC 管理端 REST 接口，处理角色/权限/用户角色分配的增删改查请求 */
@RestController
@RequestMapping("/api/admin/rbac")
public class RbacCommandController extends BaseController {

    private final RbacCommandService rbacCommandService;
    private final RbacQueryService rbacQueryService;

    public RbacCommandController(RbacCommandService rbacCommandService, RbacQueryService rbacQueryService) {
        this.rbacCommandService = rbacCommandService;
        this.rbacQueryService = rbacQueryService;
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

    @GetMapping("/role/get")
    public Result<RoleVO> getRole(@RequestParam Long id) {
        return success(rbacQueryService.getRoleById(id));
    }

    @GetMapping("/role/detail")
    public Result<RoleVO> getRoleByNum(@RequestParam String num) {
        return success(rbacQueryService.getRoleByNum(num));
    }

    @GetMapping("/role/list")
    public Result<PageResult<RoleVO>> listRoles(PageParam pageParam, String keyword, Boolean isEnabled) {
        IPage<RoleVO> page = rbacQueryService.listRoles(pageParam, keyword, isEnabled);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }

    @GetMapping("/permissions/tree")
    public Result<List<PermissionResourceVO>> listPermissionTree() {
        return success(rbacQueryService.listPermissionTree());
    }

    @GetMapping("/permissions/actions")
    public Result<List<PermissionActionVO>> listActions() {
        return success(rbacQueryService.listActions());
    }

    @GetMapping("/role/permissions")
    public Result<List<RolePermissionVO>> getRolePermissions(@RequestParam Long roleId) {
        return success(rbacQueryService.getRolePermissions(roleId));
    }

    @GetMapping("/role/users")
    public Result<PageResult<UserInRoleVO>> getUsersByRole(PageParam pageParam, @RequestParam Long roleId) {
        IPage<UserInRoleVO> page = rbacQueryService.getUsersByRole(pageParam, roleId);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }

    @GetMapping("/user/permissions")
    public Result<List<String>> getUserPermissions(@RequestParam Long userId) {
        return success(rbacQueryService.getPermissionsByUserId(userId));
    }
}
