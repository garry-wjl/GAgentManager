package com.gagentmanager.infra.home.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.home.entity.NoticeEntity;
import org.apache.ibatis.annotations.Mapper;

/** 公告数据库 Mapper 接口 */
@Mapper
public interface NoticeMapper extends BaseMapper<NoticeEntity> {}
