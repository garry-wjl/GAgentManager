package com.gagentmanager.infra.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.user.entity.UserEntity;
import org.apache.ibatis.annotations.Mapper;

/** 用户数据库 Mapper 接口 */
@Mapper
public interface UserMapper extends BaseMapper<UserEntity> {
}
