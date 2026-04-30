package com.gagentmanager.infra.user.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.user.User;
import com.gagentmanager.domain.user.UserRepository;
import com.gagentmanager.infra.user.entity.UserEntity;
import com.gagentmanager.infra.user.mapper.UserMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.stream.Collectors;

/** 用户仓储实现，支持多条件查询（用户名/真名/邮箱模糊匹配）和逻辑删除 */
@Repository
public class UserRepositoryImpl implements UserRepository {

    private final UserMapper userMapper;

    public UserRepositoryImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public User findById(Long id) {
        UserEntity e = userMapper.selectById(id);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public User findByNum(String num) {
        LambdaQueryWrapper<UserEntity> qw = new LambdaQueryWrapper<UserEntity>()
                .eq(UserEntity::getNum, num)
                .eq(UserEntity::getDeleted, false);
        UserEntity e = userMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public User findByUsername(String username) {
        LambdaQueryWrapper<UserEntity> qw = new LambdaQueryWrapper<UserEntity>()
                .eq(UserEntity::getUsername, username)
                .eq(UserEntity::getDeleted, false);
        UserEntity e = userMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public User findByEmail(String email) {
        LambdaQueryWrapper<UserEntity> qw = new LambdaQueryWrapper<UserEntity>()
                .eq(UserEntity::getEmail, email)
                .eq(UserEntity::getDeleted, false);
        UserEntity e = userMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public IPage<User> list(IPage<User> page, String keyword, String status) {
        Page<UserEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<UserEntity> qw = new LambdaQueryWrapper<UserEntity>()
                .eq(UserEntity::getDeleted, false);
        if (StringUtils.hasText(keyword)) {
            qw.and(w -> w.like(UserEntity::getUsername, keyword)
                    .or().like(UserEntity::getRealName, keyword)
                    .or().like(UserEntity::getEmail, keyword));
        }
        if (StringUtils.hasText(status)) {
            qw.eq(UserEntity::getStatus, status);
        }
        qw.orderByDesc(UserEntity::getCreateTime);
        IPage<UserEntity> result = userMapper.selectPage(mpPage, qw);
        return convertPage(result, this::toDomain);
    }

    @Override
    public void save(User user, Long operatorId) {
        user.save(operatorId);
        UserEntity e = toEntity(user);
        if (user.getId() == null) {
            userMapper.insert(e);
            user.setId(e.getId());
        } else {
            userMapper.updateById(e);
        }
    }

    @Override
    public void delete(String num, Long operatorId) {
        User user = findByNum(num);
        if (user != null) {
            user.delete(operatorId);
            userMapper.updateById(toEntity(user));
        }
    }

    private User toDomain(UserEntity e) {
        User d = new User();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private UserEntity toEntity(User d) {
        UserEntity e = new UserEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }

    private <D, E> IPage<D> convertPage(IPage<E> source, java.util.function.Function<E, D> converter) {
        Page<D> target = new Page<>(source.getCurrent(), source.getSize(), source.getTotal());
        target.setRecords(source.getRecords().stream().map(converter).collect(Collectors.toList()));
        return target;
    }
}
