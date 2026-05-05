package com.gagentmanager.infra.rbac.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.rbac.PermissionAction;
import com.gagentmanager.domain.rbac.PermissionActionRepository;
import com.gagentmanager.infra.rbac.entity.PermissionActionEntity;
import com.gagentmanager.infra.rbac.mapper.PermissionActionMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

/** 权限操作仓储实现 */
@Repository
public class PermissionActionRepositoryImpl implements PermissionActionRepository {

    private final PermissionActionMapper mapper;

    public PermissionActionRepositoryImpl(PermissionActionMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public PermissionAction findById(Long id) {
        PermissionActionEntity e = mapper.selectById(id);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public List<PermissionAction> listAll() {
        LambdaQueryWrapper<PermissionActionEntity> qw = new LambdaQueryWrapper<PermissionActionEntity>()
                .eq(PermissionActionEntity::getDeleted, false);
        return mapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    private PermissionAction toDomain(PermissionActionEntity e) {
        PermissionAction d = new PermissionAction();
        BeanUtils.copyProperties(e, d);
        return d;
    }
}
