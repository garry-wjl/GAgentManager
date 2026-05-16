package com.gagentmanager.facade.common;

import lombok.Data;

import java.util.List;

/** 分页结果封装，包含记录列表、总数、页码和页大小 */
@Data
public class PageResult<T> {
    private List<T> records;
    private long total;
    private int pageNo;
    private int pageSize;

    public static <T> PageResult<T> empty(int pageNo, int pageSize) {
        PageResult<T> result = new PageResult<>();
        result.setRecords(List.of());
        result.setTotal(0L);
        result.setPageNo(pageNo);
        result.setPageSize(pageSize);
        return result;
    }

    public static <T> PageResult<T> of(List<T> records, long total, int pageNo, int pageSize) {
        PageResult<T> result = new PageResult<>();
        result.setRecords(records);
        result.setTotal(total);
        result.setPageNo(pageNo);
        result.setPageSize(pageSize);
        return result;
    }

    public int getTotalPages() {
        return pageSize == 0 ? 0 : (int) Math.ceil((double) total / pageSize);
    }
}
