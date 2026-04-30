package com.gagentmanager.facade.common;

/** 错误码枚举，定义所有业务模块的错误码和提示信息 */
public record ErrorCode(int code, String message) {

    // Common errors
    public static final ErrorCode SUCCESS = new ErrorCode(200, "成功");
    public static final ErrorCode BAD_REQUEST = new ErrorCode(400, "请求参数错误");
    public static final ErrorCode UNAUTHORIZED = new ErrorCode(401, "未认证");
    public static final ErrorCode FORBIDDEN = new ErrorCode(403, "无权限");
    public static final ErrorCode NOT_FOUND = new ErrorCode(404, "资源不存在");
    public static final ErrorCode INTERNAL_ERROR = new ErrorCode(500, "系统内部错误");

    // Auth/User (1001-1099)
    public static final ErrorCode USERNAME_OR_PASSWORD_ERROR = new ErrorCode(1001, "用户名或密码错误");
    public static final ErrorCode ACCOUNT_DISABLED = new ErrorCode(1002, "账号已禁用");
    public static final ErrorCode ACCOUNT_LOCKED = new ErrorCode(1003, "账号已锁定");
    public static final ErrorCode TOKEN_EXPIRED = new ErrorCode(1004, "Token已过期");
    public static final ErrorCode TOKEN_INVALID = new ErrorCode(1005, "Token无效");
    public static final ErrorCode REFRESH_TOKEN_EXPIRED = new ErrorCode(1006, "Refresh Token已过期");
    public static final ErrorCode PASSWORD_INCORRECT = new ErrorCode(1007, "旧密码错误");
    public static final ErrorCode USER_NOT_FOUND = new ErrorCode(1008, "用户不存在");
    public static final ErrorCode USERNAME_ALREADY_EXISTS = new ErrorCode(1009, "用户名已存在");
    public static final ErrorCode EMAIL_ALREADY_EXISTS = new ErrorCode(1010, "邮箱已存在");
    public static final ErrorCode EMAIL_NOT_MATCH = new ErrorCode(1011, "邮箱与账号不匹配");
    public static final ErrorCode SESSION_ACCESS_DENIED = new ErrorCode(1020, "会话不属于当前用户");
    public static final ErrorCode SESSION_NOT_FOUND = new ErrorCode(1021, "会话不存在");
    public static final ErrorCode SESSION_DELETED = new ErrorCode(1022, "会话已删除");
    public static final ErrorCode AGENT_NOT_AVAILABLE = new ErrorCode(1023, "Agent不可用");
    public static final ErrorCode UPLOAD_FAILED = new ErrorCode(1024, "附件上传失败");
    public static final ErrorCode FILE_SIZE_EXCEEDED = new ErrorCode(1025, "文件大小超出限制");

    // Agent (1101-1199)
    public static final ErrorCode AGENT_CODE_ALREADY_EXISTS = new ErrorCode(1101, "Agent编码已存在");
    public static final ErrorCode AGENT_NAME_ALREADY_EXISTS = new ErrorCode(1102, "Agent名称已存在");
    public static final ErrorCode AGENT_NOT_FOUND = new ErrorCode(1103, "Agent不存在");
    public static final ErrorCode AGENT_VERSION_NOT_FOUND = new ErrorCode(1104, "Agent版本不存在");
    public static final ErrorCode AGENT_HAS_BINDINGS = new ErrorCode(1105, "Agent有资源绑定，不可删除");
    public static final ErrorCode AGENT_NOT_PUBLISHED = new ErrorCode(1106, "Agent未发布，不可部署");
    public static final ErrorCode AGENT_ALREADY_ONLINE = new ErrorCode(1107, "Agent已在线");
    public static final ErrorCode AGENT_ALREADY_OFFLINE = new ErrorCode(1108, "Agent已离线");
    public static final ErrorCode AGENT_VERSION_ALREADY_EXISTS = new ErrorCode(1109, "Agent版本已存在");
    public static final ErrorCode RESOURCE_BINDING_NOT_FOUND = new ErrorCode(1110, "资源绑定不存在");

    // Model (1201-1299)
    public static final ErrorCode MODEL_CODE_ALREADY_EXISTS = new ErrorCode(1201, "模型编码已存在");
    public static final ErrorCode MODEL_NAME_ALREADY_EXISTS = new ErrorCode(1202, "模型名称已存在");
    public static final ErrorCode MODEL_NOT_FOUND = new ErrorCode(1203, "模型不存在");
    public static final ErrorCode MODEL_CONNECTIVITY_TEST_FAILED = new ErrorCode(1204, "模型连通性测试失败");
    public static final ErrorCode MODEL_TIMEOUT_INVALID = new ErrorCode(1205, "模型超时参数无效");
    public static final ErrorCode MODEL_TEMPERATURE_INVALID = new ErrorCode(1206, "模型温度参数无效");

    // Skill (1301-1399)
    public static final ErrorCode SKILL_CODE_ALREADY_EXISTS = new ErrorCode(1301, "Skill编码已存在");
    public static final ErrorCode SKILL_ALREADY_INSTALLED = new ErrorCode(1302, "Skill已安装");
    public static final ErrorCode SKILL_NOT_INSTALLED = new ErrorCode(1303, "Skill未安装");
    public static final ErrorCode SKILL_HAS_BINDINGS = new ErrorCode(1304, "Skill有Agent绑定，不可删除");
    public static final ErrorCode SKILL_NOT_FOUND = new ErrorCode(1307, "Skill不存在");
    public static final ErrorCode SKILL_RATING_INVALID = new ErrorCode(1305, "评分超出1-5范围");
    public static final ErrorCode SKILL_REVIEW_ALREADY_EXISTS = new ErrorCode(1306, "已存在评价");

    // MCP (1401-1499)
    public static final ErrorCode MCP_CODE_ALREADY_EXISTS = new ErrorCode(1401, "MCP编码已存在");
    public static final ErrorCode MCP_NAME_ALREADY_EXISTS = new ErrorCode(1402, "MCP名称已存在");
    public static final ErrorCode MCP_DISABLED = new ErrorCode(1403, "MCP已被禁用");
    public static final ErrorCode MCP_HAS_BINDINGS = new ErrorCode(1404, "MCP有Agent绑定，不可删除");
    public static final ErrorCode MCP_NOT_FOUND = new ErrorCode(1407, "MCP不存在");
    public static final ErrorCode MCP_TEST_FAILED = new ErrorCode(1405, "连通性测试失败");
    public static final ErrorCode MCP_TIMEOUT = new ErrorCode(1406, "MCP连接超时");

    // Workflow (1501-1599)
    public static final ErrorCode WORKFLOW_CODE_ALREADY_EXISTS = new ErrorCode(1501, "工作流编码已存在");
    public static final ErrorCode WORKFLOW_NAME_ALREADY_EXISTS = new ErrorCode(1502, "工作流名称已存在");
    public static final ErrorCode WORKFLOW_NOT_FOUND = new ErrorCode(1503, "工作流不存在");
    public static final ErrorCode WORKFLOW_HAS_BINDINGS = new ErrorCode(1504, "工作流有Agent绑定，不可删除");

    // Audit (1601-1699)
    public static final ErrorCode AUDIT_LOG_NOT_FOUND = new ErrorCode(1601, "审计日志不存在");

    // RBAC (1701-1799)
    public static final ErrorCode ROLE_CODE_ALREADY_EXISTS = new ErrorCode(1701, "角色编码已存在");
    public static final ErrorCode ROLE_NAME_ALREADY_EXISTS = new ErrorCode(1702, "角色名称已存在");
    public static final ErrorCode ROLE_NOT_FOUND = new ErrorCode(1703, "角色不存在");
    public static final ErrorCode ROLE_HAS_USERS = new ErrorCode(1704, "角色下有关联用户，不可删除");
    public static final ErrorCode ROLE_IS_SYSTEM = new ErrorCode(1705, "系统内置角色，不可删除");
    public static final ErrorCode RESOURCE_NOT_FOUND = new ErrorCode(1706, "权限资源不存在");
    public static final ErrorCode ACTION_NOT_FOUND = new ErrorCode(1707, "权限操作不存在");
    public static final ErrorCode USER_ROLE_ALREADY_EXISTS = new ErrorCode(1708, "用户已关联该角色");

    // Home (1801-1899)
    public static final ErrorCode NOTICE_NOT_FOUND = new ErrorCode(1801, "通知不存在");
    public static final ErrorCode SEARCH_KEYWORD_EMPTY = new ErrorCode(1802, "搜索关键词为空");

    // System Config (1901-1999)
    public static final ErrorCode CONFIG_KEY_NOT_FOUND = new ErrorCode(1901, "配置项不存在");
    public static final ErrorCode CONFIG_NOT_MODIFIABLE = new ErrorCode(1902, "配置项不可修改");

    public BusinessException toException() {
        return new BusinessException(this);
    }
}
