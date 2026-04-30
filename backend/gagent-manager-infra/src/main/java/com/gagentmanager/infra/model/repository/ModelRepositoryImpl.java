package com.gagentmanager.infra.model.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.model.Model;
import com.gagentmanager.domain.model.ModelRepository;
import com.gagentmanager.infra.model.entity.ModelEntity;
import com.gagentmanager.infra.model.mapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.stream.Collectors;

/** 模型仓储实现 */
@Repository
public class ModelRepositoryImpl implements ModelRepository {

    private final ModelMapper modelMapper;

    public ModelRepositoryImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public Model findById(Long id) {
        ModelEntity e = modelMapper.selectById(id);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public Model findByNum(String num) {
        LambdaQueryWrapper<ModelEntity> qw = new LambdaQueryWrapper<ModelEntity>()
                .eq(ModelEntity::getNum, num)
                .eq(ModelEntity::getDeleted, false);
        ModelEntity e = modelMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public Model findByCode(String code) {
        LambdaQueryWrapper<ModelEntity> qw = new LambdaQueryWrapper<ModelEntity>()
                .eq(ModelEntity::getModelCode, code)
                .eq(ModelEntity::getDeleted, false);
        ModelEntity e = modelMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public IPage<Model> list(IPage<Model> page, String keyword, String provider, String status) {
        Page<ModelEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<ModelEntity> qw = new LambdaQueryWrapper<ModelEntity>()
                .eq(ModelEntity::getDeleted, false);
        if (StringUtils.hasText(keyword)) {
            qw.and(w -> w.like(ModelEntity::getModelName, keyword)
                    .or().like(ModelEntity::getModelCode, keyword)
                    .or().like(ModelEntity::getProvider, keyword));
        }
        if (StringUtils.hasText(provider)) {
            qw.eq(ModelEntity::getProvider, provider);
        }
        if (StringUtils.hasText(status)) {
            qw.eq(ModelEntity::getStatus, status);
        }
        qw.orderByAsc(ModelEntity::getSortOrder)
          .orderByDesc(ModelEntity::getCreateTime);
        IPage<ModelEntity> result = modelMapper.selectPage(mpPage, qw);
        return convertPage(result, this::toDomain);
    }

    @Override
    public void save(Model model, Long operatorId) {
        model.save(operatorId);
        ModelEntity e = toEntity(model);
        if (model.getId() == null) {
            modelMapper.insert(e);
            model.setId(e.getId());
        } else {
            modelMapper.updateById(e);
        }
    }

    @Override
    public void delete(String num, Long operatorId) {
        Model model = findByNum(num);
        if (model != null) {
            model.delete(operatorId);
            modelMapper.updateById(toEntity(model));
        }
    }

    @Override
    public long count() {
        LambdaQueryWrapper<ModelEntity> qw = new LambdaQueryWrapper<ModelEntity>()
                .eq(ModelEntity::getDeleted, false);
        return modelMapper.selectCount(qw);
    }

    private Model toDomain(ModelEntity e) {
        Model d = new Model();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private ModelEntity toEntity(Model d) {
        ModelEntity e = new ModelEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }

    private <D, E> IPage<D> convertPage(IPage<E> source, java.util.function.Function<E, D> converter) {
        Page<D> target = new Page<>(source.getCurrent(), source.getSize(), source.getTotal());
        target.setRecords(source.getRecords().stream().map(converter).collect(Collectors.toList()));
        return target;
    }
}
