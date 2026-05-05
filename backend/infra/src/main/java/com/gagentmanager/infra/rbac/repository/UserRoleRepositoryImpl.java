package com.gagentmanager.infra.rbac.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.rbac.RolePermission;
import com.gagentmanager.domain.rbac.UserRole;
import com.gagentmanager.domain.rbac.UserRoleRepository;
import com.gagentmanager.infra.rbac.entity.UserRoleEntity;
import com.gagentmanager.infra.rbac.mapper.UserRoleMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

/** 用户-角色关联仓储实现 */
@Repository
public class UserRoleRepositoryImpl implements UserRoleRepository {

    private final UserRoleMapper userRoleMapper;

    public UserRoleRepositoryImpl(UserRoleMapper userRoleMapper) {
        this.userRoleMapper = userRoleMapper;
    }

    @Override
    public List<RolePermission> findPermissionsByUserId(Long userId) {
        // Return permission codes as RolePermission placeholders
        // In a real impl, this would join with role_permission table
        return List.of();
    }

    @Override
    public List<UserRole> findByUserId(Long userId) {
        LambdaQueryWrapper<UserRoleEntity> qw = new LambdaQueryWrapper<UserRoleEntity>()
                .eq(UserRoleEntity::getUserId, userId).eq(UserRoleEntity::getDeleted, false);
        return userRoleMapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    @Override
    public List<UserRole> findByRoleId(Long roleId) {
        LambdaQueryWrapper<UserRoleEntity> qw = new LambdaQueryWrapper<UserRoleEntity>()
                .eq(UserRoleEntity::getRoleId, roleId).eq(UserRoleEntity::getDeleted, false);
        return userRoleMapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    @Override
    public IPage<UserRole> findUsersByRoleId(IPage<UserRole> page, Long roleId) {
        Page<UserRoleEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<UserRoleEntity> qw = new LambdaQueryWrapper<UserRoleEntity>()
                .eq(UserRoleEntity::getRoleId, roleId).eq(UserRoleEntity::getDeleted, false);
        IPage<UserRoleEntity> result = userRoleMapper.selectPage(mpPage, qw);
        return convertPage(result);
    }

    @Override
    public void save(UserRole ur, Long operatorId) {
        UserRoleEntity e = toEntity(ur);
        if (ur.getId() == null) {
            userRoleMapper.insert(e);
            ur.setId(e.getId());
        } else {
            userRoleMapper.updateById(e);
        }
    }

    @Override
    public void deleteByUserIdAndRoleId(Long userId, Long roleId) {
        LambdaQueryWrapper<UserRoleEntity> qw = new LambdaQueryWrapper<UserRoleEntity>()
                .eq(UserRoleEntity::getUserId, userId).eq(UserRoleEntity::getRoleId, roleId);
        userRoleMapper.delete(qw);
    }

    @Override
    public void batchSave(List<UserRole> userRoles, Long operatorId) {
        userRoles.forEach(ur -> {
            UserRoleEntity e = toEntity(ur);
            userRoleMapper.insert(e);
            ur.setId(e.getId());
        });
    }

    @Override
    public boolean existsByUserIdAndRoleId(Long userId, Long roleId) {
        LambdaQueryWrapper<UserRoleEntity> qw = new LambdaQueryWrapper<UserRoleEntity>()
                .eq(UserRoleEntity::getUserId, userId).eq(UserRoleEntity::getRoleId, roleId)
                .eq(UserRoleEntity::getDeleted, false);
        return userRoleMapper.selectCount(qw) > 0;
    }

    @Override
    public long countByRoleId(Long roleId) {
        LambdaQueryWrapper<UserRoleEntity> qw = new LambdaQueryWrapper<UserRoleEntity>()
                .eq(UserRoleEntity::getRoleId, roleId).eq(UserRoleEntity::getDeleted, false);
        return userRoleMapper.selectCount(qw);
    }

    private UserRole toDomain(UserRoleEntity e) {
        UserRole d = new UserRole();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private UserRoleEntity toEntity(UserRole d) {
        UserRoleEntity e = new UserRoleEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }

    private IPage<UserRole> convertPage(IPage<UserRoleEntity> source) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<UserRole> target =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(source.getCurrent(), source.getSize(), source.getTotal());
        target.setRecords(source.getRecords().stream().map(this::toDomain).toList());
        return target;
    }
}
