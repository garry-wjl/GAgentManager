package com.gagentmanager.adapter.common;

import com.gagentmanager.facade.common.Result;

/** Controller 基类，封装统一的响应格式（Result 包装） */
public class BaseController {
    protected <T> Result<T> success() {
        return Result.success();
    }

    protected <T> Result<T> success(T data) {
        return Result.success(data);
    }

    protected <T> Result<T> fail(int code, String message) {
        return Result.fail(code, message);
    }
}
