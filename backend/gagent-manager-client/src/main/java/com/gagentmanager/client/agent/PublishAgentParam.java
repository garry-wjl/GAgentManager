package com.gagentmanager.client.agent;

import lombok.Data;

/** 发布 Agent 版本参数，仅需提供变更日志 */
@Data
public class PublishAgentParam {
    private String changelog;
}
