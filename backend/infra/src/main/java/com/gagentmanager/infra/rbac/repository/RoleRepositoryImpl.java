package com.gagentmanager.infra.rbac.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.rbac.Role;
import com.gagentmanager.domain.rbac.RoleRepository;
import com.gagentmanager.infra.rbac.entity.RoleEntity;
import com.gagentmanager.infra.rbac.mapper.RoleMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

/** 角色仓储实现 */
@Repository
public class RoleRepositoryImpl implements RoleRepository {

    private final RoleMapper roleMapper;

    public RoleRepositoryImpl(RoleMapper roleMapper) {
        this.roleMapper = roleMapper;
    }

    @Override
    public Role findById(Long id) {
        RoleEntity e = roleMapper.selectById(id);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public Role findByNum(String num) {
        LambdaQueryWrapper<RoleEntity> qw = new LambdaQueryWrapper<RoleEntity>()
                .eq(RoleEntity::getNum, num).eq(RoleEntity::getDeleted, false);
        RoleEntity e = roleMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public Role findByCode(String roleCode) {
        LambdaQueryWrapper<RoleEntity> qw = new LambdaQueryWrapper<RoleEntity>()
                .eq(RoleEntity::getRoleCode, roleCode).eq(RoleEntity::getDeleted, false);
        RoleEntity e = roleMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public IPage<Role> list(IPage<Role> page, String keyword, Boolean isEnabled) {
        Page<RoleEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<RoleEntity> qw = new LambdaQueryWrapper<RoleEntity>().eq(RoleEntity::getDeleted, false);
        if (StringUtils.hasText(keyword)) {
            qw.and(w -> w.like(RoleEntity::getRoleCode, keyword).or().like(RoleEntity::getRoleName, keyword));
        }
        if (isEnabled != null) {
            qw.eq(RoleEntity::getIsEnabled, isEnabled);
        }
        qw.orderByDesc(RoleEntity::getCreateTime);
        IPage<RoleEntity> result = roleMapper.selectPage(mpPage, qw);
        return convertPage(result);
    }

    @Override
    public void save(Role role, Long operatorId) {
        role.save(operatorId);
        RoleEntity e = toEntity(role);
        if (role.getId() == null) {
            roleMapper.insert(e);
            role.setId(e.getId());
        } else {
            roleMapper.updateById(e);
        }
    }

    @Override
    public void delete(String num, Long operatorId) {
        Role role = findByNum(num);
        if (role != null) {
            role.delete(operatorId);
            roleMapper.updateById(toEntity(role));
        }
    }

    @Override
    public List<Role> listAllEnabled() {
        LambdaQueryWrapper<RoleEntity> qw = new LambdaQueryWrapper<RoleEntity>()
                .eq(RoleEntity::getDeleted, false).eq(RoleEntity::getIsEnabled, true);
        return roleMapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    private Role toDomain(RoleEntity e) {
        Role d = new Role();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private RoleEntity toEntity(Role d) {
        RoleEntity e = new RoleEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }

    private IPage<Role> convertPage(IPage<RoleEntity> source) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<Role> target =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(source.getCurrent(), source.getSize(), source.getTotal());
        target.setRecords(source.getRecords().stream().map(this::toDomain).toList());
        return target;
    }
}
