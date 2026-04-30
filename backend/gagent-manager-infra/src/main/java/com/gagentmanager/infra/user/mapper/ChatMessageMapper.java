package com.gagentmanager.infra.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.user.entity.ChatMessageEntity;
import org.apache.ibatis.annotations.Mapper;

/** 对话消息数据库 Mapper 接口 */
@Mapper
public interface ChatMessageMapper extends BaseMapper<ChatMessageEntity> {
}
