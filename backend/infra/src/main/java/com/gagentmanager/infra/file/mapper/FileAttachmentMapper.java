package com.gagentmanager.infra.file.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.file.entity.FileAttachmentEntity;
import org.apache.ibatis.annotations.Mapper;

/** 文件附件 Mapper */
@Mapper
public interface FileAttachmentMapper extends BaseMapper<FileAttachmentEntity> {
}
