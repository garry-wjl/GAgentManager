package com.gagentmanager.client.rbac;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

/** 将用户批量关联到多个角色，支持追加或覆盖模式 */
@Data
public class BatchAssignUsersParam {
    private List<Long> roleIds;
    @NotEmpty
    private List<Long> userIds;
    private String assignType;
}
