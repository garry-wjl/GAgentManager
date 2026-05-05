package com.gagentmanager.client.agent;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

/** 批量更新资源绑定排序参数 */
@Data
public class UpdateBindingSortParam {
    @NotEmpty
    private List<@Valid BindingSortItem> bindings;

    @Data
    public static class BindingSortItem {
        private String bindingNum;
        private Integer sortOrder;
    }
}
