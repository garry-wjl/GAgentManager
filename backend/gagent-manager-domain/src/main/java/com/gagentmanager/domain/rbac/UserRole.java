package com.gagentmanager.domain.rbac;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

import java.util.Date;

/** 用户-角色关联实体，记录直接分配或继承的角色关系 */
@Data
public class UserRole extends DomainEntity {
    private Long userId;
    private Long roleId;
    private String assignType;   // DIRECT/INHERITED
    private Date assignTime;
    private String assignUser;
    private Date expireTime;

    public static UserRole create(Long userId, Long roleId, String assignType, String assignUser) {
        UserRole ur = new UserRole();
        ur.userId = userId;
        ur.roleId = roleId;
        ur.assignType = assignType != null ? assignType : "DIRECT";
        ur.assignTime = new Date();
        ur.assignUser = assignUser;
        ur.setDeleted(false);
        return ur;
    }
}
