package com.gagentmanager.domain.model;

import com.baomidou.mybatisplus.core.metadata.IPage;

/** 模型仓储接口 */
public interface ModelRepository {
    Model findById(Long id);
    Model findByNum(String num);
    Model findByCode(String code);
    IPage<Model> list(IPage<Model> page, String keyword, String provider, String status);
    void save(Model model, Long operatorId);
    void delete(String num, Long operatorId);
    long count();
}
