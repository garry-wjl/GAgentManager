"""Skill management API tests."""

import pytest
from utils.api_client import APIClient
from conftest import unique_suffix


class TestSkill:

    def test_get_skills(self, admin_client: APIClient):
        """API-SK-001: Get skill list."""
        resp = admin_client.get("/admin/skills/list", params={"current": 1, "pageSize": 10})
        assert resp.status_code == 200

    def test_create_skill(self, admin_client: APIClient):
        """API-SK-002: Create a new skill."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/skills/create", json={
            "skillCode": f"test_skill_{suffix}",
            "skillName": f"测试Skill_{suffix}",
            "description": "自动化测试创建",
            "category": "工具",
        })
        assert resp.status_code == 200

    def test_update_skill(self, admin_client: APIClient):
        """API-SK-003: Update a skill."""
        resp = admin_client.get("/admin/skills/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            skill = records[0]
            resp = admin_client.post("/admin/skills/update", json={
                "id": skill.get("id"),
                "num": skill.get("num"),
                "skillName": f"Updated_{unique_suffix()}",
                "description": "Updated description",
                "category": "工具",
            })
            assert resp.status_code == 200

    def test_delete_skill(self, admin_client: APIClient):
        """API-SK-004: Delete a skill."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/skills/create", json={
            "skillCode": f"del_skill_{suffix}",
            "skillName": f"待删除Skill_{suffix}",
            "category": "测试",
        })
        if resp.status_code == 200:
            skill = resp.json().get("data", {})
            num = skill.get("num")
            if num:
                resp2 = admin_client.post("/admin/skills/delete", params={"num": num})
                assert resp2.status_code == 200

    def test_install_skill(self, admin_client: APIClient):
        """API-SK-005: Install a skill."""
        resp = admin_client.get("/admin/skills/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/skills/install", params={"num": num})
                assert resp.status_code == 200

    def test_uninstall_skill(self, admin_client: APIClient):
        """API-SK-006: Uninstall a skill."""
        resp = admin_client.get("/admin/skills/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/skills/uninstall", params={"num": num})
                assert resp.status_code == 200

    def test_get_skill_versions(self, admin_client: APIClient):
        """API-SK-007: Get skill version history."""
        resp = admin_client.get("/admin/skills/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            skill_num = records[0].get("num")
            resp = admin_client.get("/admin/skills/versions", params={"skillNum": skill_num})
            assert resp.status_code == 200

    def test_get_skill_reviews(self, admin_client: APIClient):
        """API-SK-008: Get skill reviews."""
        resp = admin_client.get("/admin/skills/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            skill_num = records[0].get("num")
            resp = admin_client.get("/admin/skills/reviews", params={"current": 1, "pageSize": 10, "skillNum": skill_num})
            assert resp.status_code == 200
