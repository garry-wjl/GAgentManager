package com.gagentmanager.domain.home;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/** 公告仓储接口 */
public interface NoticeRepository {
    Notice findByNum(String num);
    IPage<Notice> list(IPage<Notice> page, String type);
    List<Notice> findUnreadByUserId(Long userId);
    void save(Notice notice, Long operatorId);
    void delete(String num, Long operatorId);
}
