package com.gagentmanager.application.rbac;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.rbac.*;
import com.gagentmanager.domain.rbac.*;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** RBAC 查询服务，提供角色列表/权限树/角色权限关联/用户角色查询和权限码解析 */
@Service
public class RbacQueryService {

    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final UserRoleRepository userRoleRepository;
    private final PermissionResourceRepository permissionResourceRepository;
    private final PermissionActionRepository permissionActionRepository;

    public RbacQueryService(RoleRepository roleRepository, RolePermissionRepository rolePermissionRepository,
                            UserRoleRepository userRoleRepository,
                            PermissionResourceRepository permissionResourceRepository,
                            PermissionActionRepository permissionActionRepository) {
        this.roleRepository = roleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.userRoleRepository = userRoleRepository;
        this.permissionResourceRepository = permissionResourceRepository;
        this.permissionActionRepository = permissionActionRepository;
    }

    public RoleVO getRoleById(Long id) {
        Role role = roleRepository.findById(id);
        if (role == null) {
            throw new BusinessException(ErrorCode.ROLE_NOT_FOUND);
        }
        return toRoleVO(role);
    }

    public RoleVO getRoleByNum(String num) {
        Role role = roleRepository.findByNum(num);
        if (role == null) {
            throw new BusinessException(ErrorCode.ROLE_NOT_FOUND);
        }
        return toRoleVO(role);
    }

    public IPage<RoleVO> listRoles(PageParam pageParam, String keyword, Boolean isEnabled) {
        Page<Role> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<Role> rolePage = roleRepository.list(page, keyword, isEnabled);
        return rolePage.convert(this::toRoleVO);
    }

    public List<PermissionResourceVO> listPermissionTree() {
        List<PermissionResource> all = permissionResourceRepository.listAll();
        return buildTree(all, 0L);
    }

    public List<PermissionActionVO> listActions() {
        return permissionActionRepository.listAll().stream()
                .map(this::toActionVO)
                .collect(Collectors.toList());
    }

    public List<RolePermissionVO> getRolePermissions(Long roleId) {
        List<RolePermission> rps = rolePermissionRepository.findByRoleId(roleId);
        List<PermissionResource> allRes = permissionResourceRepository.listAll();
        List<PermissionAction> allAct = permissionActionRepository.listAll();
        Map<Long, PermissionResource> resMap = allRes.stream().collect(Collectors.toMap(PermissionResource::getId, r -> r));
        Map<Long, PermissionAction> actMap = allAct.stream().collect(Collectors.toMap(PermissionAction::getId, a -> a));

        return rps.stream().map(rp -> {
            RolePermissionVO vo = new RolePermissionVO();
            vo.setId(rp.getId());
            vo.setNum(rp.getNum());
            vo.setRoleId(rp.getRoleId());
            vo.setResourceId(rp.getResourceId());
            vo.setActionId(rp.getActionId());
            PermissionResource res = resMap.get(rp.getResourceId());
            if (res != null) vo.setResourceCode(res.getResourceCode());
            PermissionAction act = actMap.get(rp.getActionId());
            if (act != null) vo.setActionCode(act.getActionCode());
            vo.setPermissionCode(rp.getPermissionCode());
            vo.setGrantType(rp.getGrantType());
            return vo;
        }).collect(Collectors.toList());
    }

    public IPage<UserInRoleVO> getUsersByRole(PageParam pageParam, Long roleId) {
        Page<UserRole> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<UserRole> urPage = userRoleRepository.findUsersByRoleId(page, roleId);
        return urPage.convert(this::toUserInRoleVO);
    }

    public List<String> getPermissionsByUserId(Long userId) {
        List<UserRole> roles = userRoleRepository.findByUserId(userId);
        if (roles.isEmpty()) {
            return List.of();
        }
        List<Long> roleIds = roles.stream().map(UserRole::getRoleId).toList();
        List<RolePermission> rps = rolePermissionRepository.findByRoleIds(roleIds);
        return rps.stream()
                .filter(rp -> "ALLOW".equals(rp.getGrantType()))
                .map(RolePermission::getPermissionCode)
                .toList();
    }

    private RoleVO toRoleVO(Role r) {
        RoleVO vo = new RoleVO();
        vo.setId(r.getId());
        vo.setNum(r.getNum());
        vo.setRoleCode(r.getRoleCode());
        vo.setRoleName(r.getRoleName());
        vo.setDescription(r.getDescription());
        vo.setIsSystem(r.getIsSystem());
        vo.setIsEnabled(r.getIsEnabled());
        vo.setCreateTime(r.getCreateTime());
        vo.setUpdateTime(r.getUpdateTime());
        vo.setCreateNo(r.getCreateNo());
        vo.setUpdateNo(r.getUpdateNo());
        return vo;
    }

    private List<PermissionResourceVO> buildTree(List<PermissionResource> all, Long parentId) {
        return all.stream()
                .filter(r -> r.getParentId().equals(parentId))
                .map(r -> {
                    PermissionResourceVO vo = new PermissionResourceVO();
                    BeanUtils.copyProperties(r, vo);
                    vo.setChildren(buildTree(all, r.getId()));
                    return vo;
                })
                .collect(Collectors.toList());
    }

    private PermissionActionVO toActionVO(PermissionAction a) {
        PermissionActionVO vo = new PermissionActionVO();
        vo.setId(a.getId());
        vo.setNum(a.getNum());
        vo.setActionCode(a.getActionCode());
        vo.setActionName(a.getActionName());
        vo.setDescription(a.getDescription());
        return vo;
    }

    private UserInRoleVO toUserInRoleVO(UserRole ur) {
        UserInRoleVO vo = new UserInRoleVO();
        vo.setUserId(ur.getUserId());
        vo.setUserNum(ur.getNum());
        vo.setAssignType(ur.getAssignType());
        vo.setAssignTime(ur.getAssignTime());
        return vo;
    }
}
