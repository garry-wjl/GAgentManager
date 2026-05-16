package com.gagentmanager.client.home;

import lombok.Data;

import java.util.List;
import java.util.Map;

/** 全局搜索结果，按资源类型分组返回 */
@Data
public class SearchResultVO {
    private String keyword;
    private List<Map<String, Object>> agents;
    private List<Map<String, Object>> models;
    private List<Map<String, Object>> users;
    private List<Map<String, Object>> skills;
    private List<Map<String, Object>> mcps;
    private List<Map<String, Object>> workflows;
    private List<Map<String, Object>> roles;
}
