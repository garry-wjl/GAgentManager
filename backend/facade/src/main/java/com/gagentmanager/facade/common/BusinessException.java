package com.gagentmanager.facade.common;

import lombok.Getter;

/** 业务异常基类，携带错误码和详细信息 */
@Getter
public class BusinessException extends RuntimeException {
    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.message());
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode, String detail) {
        super(errorCode.message() + ": " + detail);
        this.errorCode = errorCode;
    }
}
