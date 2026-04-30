"""Agent management API tests."""

import pytest
from utils.api_client import APIClient
from conftest import unique_suffix


class TestAgentCRUD:

    def test_get_agents(self, admin_client: APIClient):
        """API-AG-001: Get agent list with pagination."""
        resp = admin_client.get("/admin/agents/list", params={"current": 1, "pageSize": 10})
        assert resp.status_code == 200

    def test_search_agents(self, admin_client: APIClient):
        """API-AG-002: Search agents by keyword."""
        resp = admin_client.get("/admin/agents/list", params={"current": 1, "pageSize": 10, "keyword": "客服"})
        assert resp.status_code == 200

    def test_get_agent(self, admin_client: APIClient):
        """API-AG-003: Get agent detail by ID."""
        resp = admin_client.get("/admin/agents/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            agent_id = records[0].get("id")
            resp = admin_client.get("/admin/agents/get", params={"id": agent_id})
            assert resp.status_code == 200

    def test_create_agent(self, admin_client: APIClient):
        """API-AG-004: Create a new agent."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/agents/create", json={
            "agentCode": f"test_agent_{suffix}",
            "agentName": f"测试Agent_{suffix}",
            "agentType": "CHAT",
            "description": "自动化测试创建",
            "temperature": 1.0,
            "maxTokens": 4096,
            "topP": 1.0,
        })
        assert resp.status_code == 200

    def test_create_agent_duplicate(self, admin_client: APIClient):
        """API-AG-005: Create agent with duplicate code."""
        suffix = unique_suffix()
        # First create one
        resp = admin_client.post("/admin/agents/create", json={
            "agentCode": f"dup_agent_{suffix}",
            "agentName": f"重复测试_{suffix}",
            "agentType": "CHAT",
        })
        # Then try to create again with same code
        if resp.status_code == 200:
            resp2 = admin_client.post("/admin/agents/create", json={
                "agentCode": f"dup_agent_{suffix}",
                "agentName": f"重复测试2_{suffix}",
                "agentType": "CHAT",
            })
            assert resp2.status_code == 200

    def test_create_agent_empty_name(self, admin_client: APIClient):
        """API-AG-006: Create agent with empty name/code."""
        resp = admin_client.post("/admin/agents/create", json={
            "agentCode": "",
            "agentName": "",
            "agentType": "CHAT",
        })
        assert resp.status_code == 400

    def test_update_agent(self, admin_client: APIClient):
        """API-AG-007: Update agent."""
        resp = admin_client.get("/admin/agents/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            agent = records[0]
            resp = admin_client.post("/admin/agents/update", json={
                "id": agent.get("id"),
                "num": agent.get("num"),
                "agentName": f"Updated_{unique_suffix()}",
                "description": "Updated description",
            })
            assert resp.status_code == 200

    def test_delete_agent(self, admin_client: APIClient):
        """API-AG-008: Delete an agent."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/agents/create", json={
            "agentCode": f"del_agent_{suffix}",
            "agentName": f"待删除_{suffix}",
            "agentType": "CHAT",
        })
        if resp.status_code == 200:
            agent = resp.json().get("data", {})
            num = agent.get("num")
            if num:
                resp2 = admin_client.post("/admin/agents/delete", params={"num": num})
                assert resp2.status_code == 200

    def test_publish_agent(self, admin_client: APIClient):
        """API-AG-009: Publish an agent."""
        resp = admin_client.get("/admin/agents/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/agents/publish", params={"num": num}, json={})
                assert resp.status_code == 200

    def test_online_agent(self, admin_client: APIClient):
        """API-AG-010: Online an agent."""
        resp = admin_client.get("/admin/agents/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/agents/deploy", params={"num": num})
                assert resp.status_code == 200

    def test_offline_agent(self, admin_client: APIClient):
        """API-AG-011: Offline an agent."""
        resp = admin_client.get("/admin/agents/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/agents/stop", params={"num": num})
                assert resp.status_code == 200

    def test_get_agent_versions(self, admin_client: APIClient):
        """API-AG-012: Get agent version history."""
        resp = admin_client.get("/admin/agents/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            agent_id = records[0].get("id")
            resp = admin_client.get("/admin/agents/versions", params={"agentId": agent_id})
            assert resp.status_code == 200

    def test_rollback_agent(self, admin_client: APIClient):
        """API-AG-013: Rollback agent to a previous version."""
        resp = admin_client.get("/admin/agents/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            resp = admin_client.get("/admin/agents/versions", params={"agentId": records[0].get("id")})
            vdata = resp.json()
            versions = vdata.get("data", [])
            if len(versions) >= 2:
                target = versions[-1].get("version")
                resp = admin_client.post("/admin/agents/rollback", params={"num": num, "targetVersion": target})
                assert resp.status_code == 200

    def test_get_agent_stats(self, admin_client: APIClient):
        """API-AG-014: Get agent statistics - endpoint check."""
        resp = admin_client.get("/home/dashboard")
        assert resp.status_code == 200
