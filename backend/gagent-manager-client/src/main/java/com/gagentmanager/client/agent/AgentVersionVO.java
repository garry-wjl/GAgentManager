package com.gagentmanager.client.agent;

import lombok.Data;

import java.util.Date;

/** Agent 版本视图对象，包含版本标签、变更日志和当前版本标记 */
@Data
public class AgentVersionVO {
    private String num;
    private String version;
    private String versionTag;
    private String changelog;
    private String configSnapshot;
    private String creator;
    private Date publishTime;
    private Date createTime;
    private Boolean isCurrent;
}
