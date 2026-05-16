package com.gagentmanager.facade.common;

import lombok.Data;

/** 统一 API 响应封装，提供 success/fail 工厂方法 */
@Data
public class Result<T> {
    private int code;
    private String message;
    private T data;

    public static <T> Result<T> success() {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage("success");
        return result;
    }

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage("success");
        result.setData(data);
        return result;
    }

    public static <T> Result<T> fail(int code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }

    public static <T> Result<T> fail(ErrorCode errorCode) {
        Result<T> result = new Result<>();
        result.setCode(errorCode.code());
        result.setMessage(errorCode.message());
        return result;
    }
}
