package com.gagentmanager.infra.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.user.entity.UserDeviceEntity;
import org.apache.ibatis.annotations.Mapper;

/** 登录设备 Mapper */
@Mapper
public interface UserDeviceMapper extends BaseMapper<UserDeviceEntity> {
}
