package com.gagentmanager.infra.rbac.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.rbac.PermissionResource;
import com.gagentmanager.domain.rbac.PermissionResourceRepository;
import com.gagentmanager.infra.rbac.entity.PermissionResourceEntity;
import com.gagentmanager.infra.rbac.mapper.PermissionResourceMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

/** 权限资源仓储实现 */
@Repository
public class PermissionResourceRepositoryImpl implements PermissionResourceRepository {

    private final PermissionResourceMapper mapper;

    public PermissionResourceRepositoryImpl(PermissionResourceMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public PermissionResource findById(Long id) {
        PermissionResourceEntity e = mapper.selectById(id);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public List<PermissionResource> listAll() {
        LambdaQueryWrapper<PermissionResourceEntity> qw = new LambdaQueryWrapper<PermissionResourceEntity>()
                .eq(PermissionResourceEntity::getDeleted, false).orderByAsc(PermissionResourceEntity::getSortOrder);
        return mapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    @Override
    public List<PermissionResource> findByParentId(Long parentId) {
        LambdaQueryWrapper<PermissionResourceEntity> qw = new LambdaQueryWrapper<PermissionResourceEntity>()
                .eq(PermissionResourceEntity::getParentId, parentId).eq(PermissionResourceEntity::getDeleted, false)
                .orderByAsc(PermissionResourceEntity::getSortOrder);
        return mapper.selectList(qw).stream().map(this::toDomain).toList();
    }

    @Override
    public void save(PermissionResource resource, Long operatorId) {
        PermissionResourceEntity e = toEntity(resource);
        if (resource.getId() == null) {
            mapper.insert(e);
            resource.setId(e.getId());
        } else {
            mapper.updateById(e);
        }
    }

    private PermissionResource toDomain(PermissionResourceEntity e) {
        PermissionResource d = new PermissionResource();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private PermissionResourceEntity toEntity(PermissionResource d) {
        PermissionResourceEntity e = new PermissionResourceEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }
}
