package com.gagentmanager.infra.rbac.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.rbac.RolePermission;
import com.gagentmanager.domain.rbac.RolePermissionRepository;
import com.gagentmanager.infra.rbac.entity.RolePermissionEntity;
import com.gagentmanager.infra.rbac.mapper.RolePermissionMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

/** 角色-权限关联仓储实现 */
@Repository
public class RolePermissionRepositoryImpl implements RolePermissionRepository {

    private final RolePermissionMapper mapper;

    public RolePermissionRepositoryImpl(RolePermissionMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public List<RolePermission> findByRoleId(Long roleId) {
        LambdaQueryWrapper<RolePermissionEntity> qw = new LambdaQueryWrapper<RolePermissionEntity>()
                .eq(RolePermissionEntity::getRoleId, roleId).eq(RolePermissionEntity::getDeleted, false);
        return mapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    @Override
    public List<RolePermission> findByRoleIds(List<Long> roleIds) {
        LambdaQueryWrapper<RolePermissionEntity> qw = new LambdaQueryWrapper<RolePermissionEntity>()
                .in(RolePermissionEntity::getRoleId, roleIds).eq(RolePermissionEntity::getDeleted, false);
        return mapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    @Override
    public void save(RolePermission rp, Long operatorId) {
        RolePermissionEntity e = toEntity(rp);
        if (rp.getId() == null) {
            mapper.insert(e);
            rp.setId(e.getId());
        } else {
            mapper.updateById(e);
        }
    }

    @Override
    public void deleteByRoleIdAndResourceId(Long roleId, Long resourceId) {
        LambdaQueryWrapper<RolePermissionEntity> qw = new LambdaQueryWrapper<RolePermissionEntity>()
                .eq(RolePermissionEntity::getRoleId, roleId).eq(RolePermissionEntity::getResourceId, resourceId);
        mapper.delete(qw);
    }

    @Override
    public void batchDeleteByRoleId(Long roleId) {
        LambdaQueryWrapper<RolePermissionEntity> qw = new LambdaQueryWrapper<RolePermissionEntity>()
                .eq(RolePermissionEntity::getRoleId, roleId);
        mapper.delete(qw);
    }

    @Override
    public void batchSave(List<RolePermission> permissions, Long operatorId) {
        permissions.forEach(p -> {
            RolePermissionEntity e = toEntity(p);
            if (p.getId() == null) {
                mapper.insert(e);
            } else {
                mapper.updateById(e);
            }
        });
    }

    private RolePermission toDomain(RolePermissionEntity e) {
        RolePermission d = new RolePermission();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private RolePermissionEntity toEntity(RolePermission d) {
        RolePermissionEntity e = new RolePermissionEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }
}
