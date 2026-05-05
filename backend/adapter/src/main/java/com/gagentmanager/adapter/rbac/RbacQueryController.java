package com.gagentmanager.adapter.rbac;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.rbac.RbacQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.rbac.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** RBAC 管理端 Query REST 接口，处理角色/权限/用户角色分配的查询请求 */
@RestController
@RequestMapping("/api/rbac/query")
public class RbacQueryController extends BaseController {

    private final RbacQueryService rbacQueryService;

    public RbacQueryController(RbacQueryService rbacQueryService) {
        this.rbacQueryService = rbacQueryService;
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
