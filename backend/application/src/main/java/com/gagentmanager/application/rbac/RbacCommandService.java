package com.gagentmanager.application.rbac;

import com.gagentmanager.client.rbac.*;
import com.gagentmanager.domain.rbac.*;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/** RBAC 写操作服务，负责角色 CRUD、用户角色分配/移除、权限分配 */
@Service
public class RbacCommandService {

    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final UserRoleRepository userRoleRepository;
    private final PermissionResourceRepository permissionResourceRepository;
    private final PermissionActionRepository permissionActionRepository;

    public RbacCommandService(RoleRepository roleRepository, RolePermissionRepository rolePermissionRepository,
                              UserRoleRepository userRoleRepository,
                              PermissionResourceRepository permissionResourceRepository,
                              PermissionActionRepository permissionActionRepository) {
        this.roleRepository = roleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.userRoleRepository = userRoleRepository;
        this.permissionResourceRepository = permissionResourceRepository;
        this.permissionActionRepository = permissionActionRepository;
    }

    public RoleVO createRole(CreateRoleParam param, Long operatorId) {
        Role existing = roleRepository.findByCode(param.getRoleCode());
        if (existing != null) {
            throw new BusinessException(ErrorCode.ROLE_CODE_ALREADY_EXISTS);
        }
        Role role = new Role();
        BeanUtils.copyProperties(param, role);
        role.save(operatorId);
        roleRepository.save(role, operatorId);
        return toRoleVO(role);
    }

    public void updateRole(UpdateRoleParam param, Long operatorId) {
        Role role = roleRepository.findById(param.getId());
        if (role == null) {
            throw new BusinessException(ErrorCode.ROLE_NOT_FOUND);
        }
        BeanUtils.copyProperties(param, role, "id", "roleCode");
        role.setUpdateNo(String.valueOf(operatorId));
        roleRepository.save(role, operatorId);
    }

    public void deleteRole(String num, Long operatorId) {
        Role role = roleRepository.findByNum(num);
        if (role == null) {
            throw new BusinessException(ErrorCode.ROLE_NOT_FOUND);
        }
        role.delete(operatorId);
        roleRepository.delete(num, operatorId);
    }

    public void enableRole(String num, Long operatorId) {
        Role role = roleRepository.findByNum(num);
        if (role == null) {
            throw new BusinessException(ErrorCode.ROLE_NOT_FOUND);
        }
        role.enable(operatorId);
        roleRepository.save(role, operatorId);
    }

    public void disableRole(String num, Long operatorId) {
        Role role = roleRepository.findByNum(num);
        if (role == null) {
            throw new BusinessException(ErrorCode.ROLE_NOT_FOUND);
        }
        role.disable(operatorId);
        roleRepository.save(role, operatorId);
    }

    public void assignUsers(AssignUsersParam param, Long operatorId) {
        for (Long userId : param.getUserIds()) {
            boolean exists = userRoleRepository.existsByUserIdAndRoleId(userId, param.getRoleId());
            if (exists) {
                continue;
            }
            UserRole ur = UserRole.create(userId, param.getRoleId(), "DIRECT", String.valueOf(operatorId));
            userRoleRepository.save(ur, operatorId);
        }
    }

    public void removeUserFromRole(Long userId, Long roleId, Long operatorId) {
        userRoleRepository.deleteByUserIdAndRoleId(userId, roleId);
    }

    public void assignPermissions(AssignPermissionsParam param, Long operatorId) {
        rolePermissionRepository.batchDeleteByRoleId(param.getRoleId());
        if (param.getResourceIds() != null && param.getActionIds() != null) {
            List<RolePermission> permissions = new ArrayList<>();
            for (Long resId : param.getResourceIds()) {
                PermissionResource res = permissionResourceRepository.findById(resId);
                if (res == null) {
                    throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
                }
                for (Long actId : param.getActionIds()) {
                    PermissionAction act = permissionActionRepository.findById(actId);
                    if (act == null) {
                        throw new BusinessException(ErrorCode.ACTION_NOT_FOUND);
                    }
                    RolePermission rp = RolePermission.create(
                            param.getRoleId(), resId, actId,
                            res.getResourceCode() + ":" + act.getActionCode(),
                            param.getGrantType() != null ? param.getGrantType() : "ALLOW");
                    permissions.add(rp);
                }
            }
            rolePermissionRepository.batchSave(permissions, operatorId);
        }
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
}
