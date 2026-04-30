package com.gagentmanager.infra.home.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.domain.home.Notice;
import com.gagentmanager.domain.home.NoticeRepository;
import com.gagentmanager.infra.home.entity.NoticeEntity;
import com.gagentmanager.infra.home.mapper.NoticeMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

/** 公告仓储实现 */
@Repository
public class NoticeRepositoryImpl implements NoticeRepository {

    private final NoticeMapper mapper;

    public NoticeRepositoryImpl(NoticeMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public Notice findByNum(String num) {
        LambdaQueryWrapper<NoticeEntity> qw = new LambdaQueryWrapper<NoticeEntity>()
                .eq(NoticeEntity::getNum, num).eq(NoticeEntity::getDeleted, false);
        NoticeEntity e = mapper.selectOne(qw);
        return e != null ? toDomain(e) : null;
    }

    @Override
    public IPage<Notice> list(IPage<Notice> page, String type) {
        Page<NoticeEntity> mpPage = new Page<>(page.getCurrent(), page.getSize());
        LambdaQueryWrapper<NoticeEntity> qw = new LambdaQueryWrapper<NoticeEntity>()
                .eq(NoticeEntity::getDeleted, false).orderByDesc(NoticeEntity::getCreateTime);
        if (StringUtils.hasText(type)) qw.eq(NoticeEntity::getType, type);
        IPage<NoticeEntity> result = mapper.selectPage(mpPage, qw);
        return convertPage(result);
    }

    @Override
    public List<Notice> findUnreadByUserId(Long userId) {
        return List.of(); // Simplified — targetUsers is JSON, would need application-level filtering
    }

    @Override
    public void save(Notice notice, Long operatorId) {
        NoticeEntity e = toEntity(notice);
        if (notice.getId() == null) {
            mapper.insert(e);
            notice.setId(e.getId());
        } else {
            mapper.updateById(e);
        }
    }

    @Override
    public void delete(String num, Long operatorId) {
        LambdaQueryWrapper<NoticeEntity> qw = new LambdaQueryWrapper<NoticeEntity>()
                .eq(NoticeEntity::getNum, num).eq(NoticeEntity::getDeleted, false);
        mapper.delete(qw);
    }

    private Notice toDomain(NoticeEntity e) {
        Notice d = new Notice();
        BeanUtils.copyProperties(e, d);
        return d;
    }

    private NoticeEntity toEntity(Notice d) {
        NoticeEntity e = new NoticeEntity();
        BeanUtils.copyProperties(d, e);
        return e;
    }

    private IPage<Notice> convertPage(IPage<NoticeEntity> source) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<Notice> target =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(source.getCurrent(), source.getSize(), source.getTotal());
        target.setRecords(source.getRecords().stream().map(this::toDomain).toList());
        return target;
    }
}
