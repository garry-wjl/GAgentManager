package com.gagentmanager.infra.prompt.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.prompt.entity.PromptTemplateEntity;
import org.apache.ibatis.annotations.Mapper;

/** Prompt 模板 Mapper */
@Mapper
public interface PromptMapper extends BaseMapper<PromptTemplateEntity> {
}
