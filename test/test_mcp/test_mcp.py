"""MCP management API tests."""

import pytest
from utils.api_client import APIClient
from conftest import unique_suffix


class TestMCP:

    def test_get_mcps(self, admin_client: APIClient):
        """API-MC-001: Get MCP list."""
        resp = admin_client.get("/admin/mcps/list", params={"current": 1, "pageSize": 10})
        assert resp.status_code == 200

    def test_create_mcp(self, admin_client: APIClient):
        """API-MC-002: Create a new MCP service."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/mcps/create", json={
            "mcpCode": f"test_mcp_{suffix}",
            "mcpName": f"测试MCP_{suffix}",
            "description": "自动化测试创建",
            "serverUrl": "http://localhost:8080/mcp",
            "protocolVersion": "v1.0",
            "transportType": "sse",
            "authType": "none",
            "timeoutSeconds": 30,
        })
        assert resp.status_code == 200

    def test_update_mcp(self, admin_client: APIClient):
        """API-MC-003: Update an MCP service."""
        resp = admin_client.get("/admin/mcps/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            mcp = records[0]
            resp = admin_client.post("/admin/mcps/update", json={
                "id": mcp.get("id"),
                "num": mcp.get("num"),
                "mcpName": f"Updated_{unique_suffix()}",
            })
            assert resp.status_code == 200

    def test_delete_mcp(self, admin_client: APIClient):
        """API-MC-004: Delete an MCP service."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/mcps/create", json={
            "mcpCode": f"del_mcp_{suffix}",
            "mcpName": f"待删除MCP_{suffix}",
            "serverUrl": "http://localhost:8080/mcp_del",
            "protocolVersion": "v1.0",
            "transportType": "sse",
            "authType": "none",
        })
        if resp.status_code == 200:
            mcp = resp.json().get("data", {})
            num = mcp.get("num")
            if num:
                resp2 = admin_client.post("/admin/mcps/delete", params={"num": num})
                assert resp2.status_code == 200

    def test_enable_mcp(self, admin_client: APIClient):
        """API-MC-005: Enable a disabled MCP."""
        resp = admin_client.get("/admin/mcps/list", params={"current": 1, "pageSize": 20, "status": "DISABLED"})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/mcps/enable", params={"num": num})
                assert resp.status_code == 200

    def test_disable_mcp(self, admin_client: APIClient):
        """API-MC-006: Disable an enabled MCP."""
        resp = admin_client.get("/admin/mcps/list", params={"current": 1, "pageSize": 20, "status": "ENABLED"})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/mcps/disable", params={"num": num})
                assert resp.status_code == 200

    def test_mcp_connection(self, admin_client: APIClient):
        """API-MC-007: Test MCP connectivity."""
        resp = admin_client.get("/admin/mcps/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/mcps/test", params={"num": num})
                assert resp.status_code == 200
