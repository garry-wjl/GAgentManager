package com.gagentmanager.domain.user;

import com.gagentmanager.client.common.PageParam;
import com.baomidou.mybatisplus.core.metadata.IPage;

/** 用户仓储接口 */
public interface UserRepository {
    User findById(Long id);
    User findByNum(String num);
    User findByUsername(String username);
    User findByEmail(String email);
    IPage<User> list(IPage<User> page, String keyword, String status);
    void save(User user, Long operatorId);
    void delete(String num, Long operatorId);
}
