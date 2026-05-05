package com.gagentmanager.infra.user.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.user.UserDevice;
import com.gagentmanager.domain.user.UserDeviceRepository;
import com.gagentmanager.infra.user.entity.UserDeviceEntity;
import com.gagentmanager.infra.user.mapper.UserDeviceMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

/** 登录设备仓储实现 */
@Repository
public class UserDeviceRepositoryImpl implements UserDeviceRepository {

    private final UserDeviceMapper userDeviceMapper;

    public UserDeviceRepositoryImpl(UserDeviceMapper userDeviceMapper) {
        this.userDeviceMapper = userDeviceMapper;
    }

    @Override
    public UserDevice findByNum(String num) {
        LambdaQueryWrapper<UserDeviceEntity> qw = new LambdaQueryWrapper<UserDeviceEntity>()
                .eq(UserDeviceEntity::getNum, num)
                .eq(UserDeviceEntity::getDeleted, false);
        UserDeviceEntity e = userDeviceMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public List<UserDevice> listByUserId(Long userId) {
        LambdaQueryWrapper<UserDeviceEntity> qw = new LambdaQueryWrapper<UserDeviceEntity>()
                .eq(UserDeviceEntity::getUserId, userId)
                .eq(UserDeviceEntity::getDeleted, false)
                .orderByDesc(UserDeviceEntity::getLastActiveTime);
        List<UserDeviceEntity> entities = userDeviceMapper.selectList(qw);
        return entities.stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public void save(UserDevice device, Long operatorId) {
        device.save(operatorId);
        UserDeviceEntity e = toEntity(device);
        if (device.getId() == null) {
            userDeviceMapper.insert(e);
            device.setId(e.getId());
        } else {
            userDeviceMapper.updateById(e);
        }
    }

    @Override
    public void kickOut(String num, Long operatorId) {
        UserDevice device = findByNum(num);
        if (device != null) {
            device.kickOut(operatorId);
            userDeviceMapper.updateById(toEntity(device));
        }
    }

    private UserDevice toDomain(UserDeviceEntity e) {
        UserDevice d = new UserDevice();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private UserDeviceEntity toEntity(UserDevice d) {
        UserDeviceEntity e = new UserDeviceEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }
}
