package com.gagentmanager.infra.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.user.entity.ChatShareEntity;
import org.apache.ibatis.annotations.Mapper;

/** 对话分享 Mapper */
@Mapper
public interface ChatShareMapper extends BaseMapper<ChatShareEntity> {
}
