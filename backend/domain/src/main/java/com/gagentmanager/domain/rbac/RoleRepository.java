package com.gagentmanager.domain.rbac;

import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;

/** 角色仓储接口 */
public interface RoleRepository {
    Role findById(Long id);
    Role findByNum(String num);
    Role findByCode(String roleCode);
    IPage<Role> list(IPage<Role> page, String keyword, Boolean isEnabled);
    void save(Role role, Long operatorId);
    void delete(String num, Long operatorId);
    List<Role> listAllEnabled();
}
