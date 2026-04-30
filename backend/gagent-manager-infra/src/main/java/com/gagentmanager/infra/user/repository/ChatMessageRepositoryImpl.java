package com.gagentmanager.infra.user.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.user.ChatMessage;
import com.gagentmanager.domain.user.ChatMessageRepository;
import com.gagentmanager.infra.user.entity.ChatMessageEntity;
import com.gagentmanager.infra.user.mapper.ChatMessageMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

/** 对话消息仓储实现，支持按会话分页查询（按时间升序）和批量保存 */
@Repository
public class ChatMessageRepositoryImpl implements ChatMessageRepository {

    private final ChatMessageMapper chatMessageMapper;

    public ChatMessageRepositoryImpl(ChatMessageMapper chatMessageMapper) {
        this.chatMessageMapper = chatMessageMapper;
    }

    @Override
    public ChatMessage findByNum(String num) {
        LambdaQueryWrapper<ChatMessageEntity> qw = new LambdaQueryWrapper<ChatMessageEntity>()
                .eq(ChatMessageEntity::getNum, num)
                .eq(ChatMessageEntity::getDeleted, false);
        ChatMessageEntity e = chatMessageMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public IPage<ChatMessage> findBySessionId(IPage<ChatMessage> page, Long sessionId) {
        Page<ChatMessageEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<ChatMessageEntity> qw = new LambdaQueryWrapper<ChatMessageEntity>()
                .eq(ChatMessageEntity::getSessionId, sessionId)
                .eq(ChatMessageEntity::getDeleted, false)
                .orderByAsc(ChatMessageEntity::getCreateTime);
        IPage<ChatMessageEntity> result = chatMessageMapper.selectPage(mpPage, qw);
        return convertPage(result, this::toDomain);
    }

    @Override
    public void save(ChatMessage message) {
        ChatMessageEntity e = toEntity(message);
        if (message.getId() == null) {
            chatMessageMapper.insert(e);
            message.setId(e.getId());
        } else {
            chatMessageMapper.updateById(e);
        }
    }

    @Override
    public void batchSave(List<ChatMessage> messages) {
        if (messages == null || messages.isEmpty()) {
            return;
        }
        List<ChatMessageEntity> entities = messages.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
        for (ChatMessageEntity e : entities) {
            chatMessageMapper.insert(e);
        }
    }

    private ChatMessage toDomain(ChatMessageEntity e) {
        ChatMessage d = new ChatMessage();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private ChatMessageEntity toEntity(ChatMessage d) {
        ChatMessageEntity e = new ChatMessageEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }

    private <D, E> IPage<D> convertPage(IPage<E> source, java.util.function.Function<E, D> converter) {
        Page<D> target = new Page<>(source.getCurrent(), source.getSize(), source.getTotal());
        target.setRecords(source.getRecords().stream().map(converter).collect(Collectors.toList()));
        return target;
    }
}
