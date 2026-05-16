package com.gagentmanager.infra.file.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.file.FileAttachment;
import com.gagentmanager.domain.file.FileAttachmentRepository;
import com.gagentmanager.infra.file.entity.FileAttachmentEntity;
import com.gagentmanager.infra.file.mapper.FileAttachmentMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

/** 文件附件仓储实现 */
@Repository
public class FileAttachmentRepositoryImpl implements FileAttachmentRepository {

    private final FileAttachmentMapper fileAttachmentMapper;

    public FileAttachmentRepositoryImpl(FileAttachmentMapper fileAttachmentMapper) {
        this.fileAttachmentMapper = fileAttachmentMapper;
    }

    @Override
    public FileAttachment findByNum(String num) {
        LambdaQueryWrapper<FileAttachmentEntity> qw = new LambdaQueryWrapper<FileAttachmentEntity>()
                .eq(FileAttachmentEntity::getNum, num)
                .eq(FileAttachmentEntity::getDeleted, false);
        FileAttachmentEntity e = fileAttachmentMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public List<FileAttachment> findBySessionId(Long sessionId) {
        LambdaQueryWrapper<FileAttachmentEntity> qw = new LambdaQueryWrapper<FileAttachmentEntity>()
                .eq(FileAttachmentEntity::getSessionId, sessionId)
                .eq(FileAttachmentEntity::getDeleted, false)
                .orderByDesc(FileAttachmentEntity::getCreateTime);
        List<FileAttachmentEntity> entities = fileAttachmentMapper.selectList(qw);
        return entities.stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public void save(FileAttachment attachment, Long operatorId) {
        attachment.save(operatorId);
        FileAttachmentEntity e = toEntity(attachment);
        if (attachment.getId() == null) {
            fileAttachmentMapper.insert(e);
            attachment.setId(e.getId());
        } else {
            fileAttachmentMapper.updateById(e);
        }
    }

    @Override
    public void delete(String num, Long operatorId) {
        FileAttachment attachment = findByNum(num);
        if (attachment != null) {
            attachment.delete(operatorId);
            fileAttachmentMapper.updateById(toEntity(attachment));
        }
    }

    private FileAttachment toDomain(FileAttachmentEntity e) {
        FileAttachment d = new FileAttachment();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private FileAttachmentEntity toEntity(FileAttachment d) {
        FileAttachmentEntity e = new FileAttachmentEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }
}
