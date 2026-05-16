# GAgentManager 接口自动化测试

## 环境准备

```bash
cd test
pip install -r requirements.txt
```

## 配置修改

编辑 `config.py`，根据实际情况修改：

```python
BASE_URL = "http://localhost:8080/api"   # 后端地址
ADMIN_ACCOUNT = "admin"                   # 管理员账号
ADMIN_PASSWORD = "admin123"               # 管理员密码
USER_ACCOUNT = "13800138000"              # 普通用户账号
USER_PASSWORD = "user123"                 # 普通用户密码
```

## 运行测试

```bash
# 运行所有测试
pytest -v

# 运行指定模块
pytest test_auth/ -v
pytest test_agent/ -v

# 运行单个测试文件
pytest test_auth/test_login.py -v

# 运行指定用例
pytest -k "test_login_success" -v

# 生成HTML报告
pytest --html=report.html --self-contained-html

# 生成Allure报告
pytest --alluredir=allure-results
allure serve allure-results
```

## 目录结构

```
test/
├── config.py                    # 测试配置（修改后端地址和账号密码）
├── conftest.py                  # Pytest fixtures（session级admin/user客户端）
├── requirements.txt             # Python依赖
├── utils/
│   ├── __init__.py
│   └── api_client.py            # 封装的HTTP客户端（自动携带Token）
├── test_auth/                   # 认证模块（登录/密码重置）
├── test_user/                   # 用户管理（CRUD/启用禁用/批量操作）
├── test_agent/                  # Agent管理（CRUD/发布上下线/版本回滚）
├── test_permission/             # RBAC权限（角色/权限矩阵/用户关联）
├── test_model/                  # 模型管理（CRUD/连通性测试/监控）
├── test_mcp/                    # MCP管理（CRUD/连通性测试）
├── test_skill/                  # Skill管理（CRUD/安装卸载/版本）
├── test_system/                 # 系统配置（参数读写）
├── test_chat/                   # 用户端对话（会话/消息/流式响应）
└── test_profile/                # 个人中心（信息修改/密码/历史）
```

## 用例统计

| 维度 | 数量 |
|------|------|
| 总用例 | 98 |
| P0 关键 | 73 |
| P1 重要 | 22 |
| P2 一般 | 3 |

## 测试框架

- **pytest** - 测试框架
- **requests** - HTTP 客户端
- **pytest-html** - HTML 测试报告
- **allure-pytest** - Allure 测试报告

## 注意事项

1. 测试前确保后端服务已启动（默认 `http://localhost:8080`）
2. 测试用例会创建/修改/删除数据，建议在测试环境运行
3. 部分用例会依赖前置数据（如获取列表后再操作），如果前置条件不满足会跳过
4. SSE 流式响应测试会验证 `data:` 前缀和实际内容返回
