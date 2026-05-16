package com.gagentmanager.client.rbac;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/** 为角色批量关联用户参数 */
@Data
public class AssignUsersParam {
    @NotNull
    private Long roleId;
    @NotEmpty
    private List<Long> userIds;
}
