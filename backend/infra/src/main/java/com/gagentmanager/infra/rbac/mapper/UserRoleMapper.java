package com.gagentmanager.infra.rbac.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gagentmanager.infra.rbac.entity.UserRoleEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/** 用户-角色关联数据库 Mapper 接口，包含关联查询用户权限编码的自定义方法 */
@Mapper
public interface UserRoleMapper extends BaseMapper<UserRoleEntity> {
    @Select("SELECT rp.permission_code FROM user_role ur " +
            "JOIN role_permission rp ON ur.role_id = rp.role_id AND rp.deleted = 0 " +
            "WHERE ur.user_id = #{userId} AND ur.deleted = 0")
    List<String> selectPermissionCodesByUserId(@Param("userId") Long userId);
}
