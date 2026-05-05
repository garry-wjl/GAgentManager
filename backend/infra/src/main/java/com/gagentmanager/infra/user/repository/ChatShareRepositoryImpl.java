package com.gagentmanager.infra.user.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.user.ChatShare;
import com.gagentmanager.domain.user.ChatShareRepository;
import com.gagentmanager.infra.user.entity.ChatShareEntity;
import com.gagentmanager.infra.user.mapper.ChatShareMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

/** 对话分享仓储实现 */
@Repository
public class ChatShareRepositoryImpl implements ChatShareRepository {

    private final ChatShareMapper chatShareMapper;

    public ChatShareRepositoryImpl(ChatShareMapper chatShareMapper) {
        this.chatShareMapper = chatShareMapper;
    }

    @Override
    public ChatShare findByShareToken(String shareToken) {
        LambdaQueryWrapper<ChatShareEntity> qw = new LambdaQueryWrapper<ChatShareEntity>()
                .eq(ChatShareEntity::getShareToken, shareToken)
                .eq(ChatShareEntity::getDeleted, false);
        ChatShareEntity e = chatShareMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public ChatShare findBySessionId(Long sessionId) {
        LambdaQueryWrapper<ChatShareEntity> qw = new LambdaQueryWrapper<ChatShareEntity>()
                .eq(ChatShareEntity::getSessionId, sessionId)
                .eq(ChatShareEntity::getDeleted, false)
                .orderByDesc(ChatShareEntity::getCreateTime)
                .last("LIMIT 1");
        ChatShareEntity e = chatShareMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public void save(ChatShare share, Long operatorId) {
        share.save(operatorId);
        ChatShareEntity e = toEntity(share);
        if (share.getId() == null) {
            chatShareMapper.insert(e);
            share.setId(e.getId());
        } else {
            chatShareMapper.updateById(e);
        }
    }

    @Override
    public void invalidate(String shareToken, Long operatorId) {
        ChatShare share = findByShareToken(shareToken);
        if (share != null) {
            share.invalidate(operatorId);
            chatShareMapper.updateById(toEntity(share));
        }
    }

    private ChatShare toDomain(ChatShareEntity e) {
        ChatShare d = new ChatShare();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private ChatShareEntity toEntity(ChatShare d) {
        ChatShareEntity e = new ChatShareEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }
}
