package com.gagentmanager.infra.user.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gagentmanager.domain.user.ChatSession;
import com.gagentmanager.domain.user.ChatSessionRepository;
import com.gagentmanager.infra.user.entity.ChatSessionEntity;
import com.gagentmanager.infra.user.mapper.ChatSessionMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

/** 对话会话仓储实现，支持按用户+Agent 查询、重命名和逻辑删除 */
@Repository
public class ChatSessionRepositoryImpl implements ChatSessionRepository {

    private final ChatSessionMapper chatSessionMapper;

    public ChatSessionRepositoryImpl(ChatSessionMapper chatSessionMapper) {
        this.chatSessionMapper = chatSessionMapper;
    }

    @Override
    public ChatSession findById(Long id) {
        ChatSessionEntity e = chatSessionMapper.selectById(id);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public ChatSession findByNum(String num) {
        LambdaQueryWrapper<ChatSessionEntity> qw = new LambdaQueryWrapper<ChatSessionEntity>()
                .eq(ChatSessionEntity::getNum, num)
                .eq(ChatSessionEntity::getDeleted, false);
        ChatSessionEntity e = chatSessionMapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public List<ChatSession> findByUserIdAndAgentId(Long userId, Long agentId) {
        LambdaQueryWrapper<ChatSessionEntity> qw = new LambdaQueryWrapper<ChatSessionEntity>()
                .eq(ChatSessionEntity::getUserId, userId)
                .eq(ChatSessionEntity::getAgentId, agentId)
                .eq(ChatSessionEntity::getDeleted, false)
                .orderByDesc(ChatSessionEntity::getLastMessageTime);
        List<ChatSessionEntity> entities = chatSessionMapper.selectList(qw);
        return entities.stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<ChatSession> listByUserId(Long userId) {
        LambdaQueryWrapper<ChatSessionEntity> qw = new LambdaQueryWrapper<ChatSessionEntity>()
                .eq(ChatSessionEntity::getUserId, userId)
                .eq(ChatSessionEntity::getDeleted, false)
                .orderByDesc(ChatSessionEntity::getLastMessageTime);
        List<ChatSessionEntity> entities = chatSessionMapper.selectList(qw);
        return entities.stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public void save(ChatSession session, Long operatorId) {
        session.save(operatorId);
        ChatSessionEntity e = toEntity(session);
        if (session.getId() == null) {
            chatSessionMapper.insert(e);
            session.setId(e.getId());
        } else {
            chatSessionMapper.updateById(e);
        }
    }

    @Override
    public void delete(String num, Long operatorId) {
        ChatSession session = findByNum(num);
        if (session != null) {
            session.delete(operatorId);
            chatSessionMapper.updateById(toEntity(session));
        }
    }

    @Override
    public void rename(String num, String newTitle, Long operatorId) {
        ChatSession session = findByNum(num);
        if (session != null) {
            session.rename(newTitle, operatorId);
            chatSessionMapper.updateById(toEntity(session));
        }
    }

    private ChatSession toDomain(ChatSessionEntity e) {
        ChatSession d = new ChatSession();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private ChatSessionEntity toEntity(ChatSession d) {
        ChatSessionEntity e = new ChatSessionEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }
}
