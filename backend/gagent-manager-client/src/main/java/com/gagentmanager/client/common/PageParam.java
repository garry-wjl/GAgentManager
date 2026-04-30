package com.gagentmanager.client.common;

import lombok.Data;

/** 通用分页查询参数，包含页码和页大小，提供偏移量计算方法 */
@Data
public class PageParam {
    private int pageNo = 1;
    private int pageSize = 10;

    public int getOffset() {
        return (pageNo - 1) * pageSize;
    }
}
