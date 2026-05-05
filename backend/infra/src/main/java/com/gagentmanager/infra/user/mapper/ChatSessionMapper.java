package com.gagentmanager.infra.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.user.entity.ChatSessionEntity;
import org.apache.ibatis.annotations.Mapper;

/** 对话会话数据库 Mapper 接口 */
@Mapper
public interface ChatSessionMapper extends BaseMapper<ChatSessionEntity> {
}
