package com.gagentmanager.client.user;

import lombok.Data;

import java.util.List;

/** 发送对话消息参数，包含内容和可选附件列表 */
@Data
public class SendMessageParam {
    private String sessionNum;
    private String content;
    private List<AttachmentVO> attachments;
}
