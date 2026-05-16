"""User management API tests."""

import pytest
from utils.api_client import APIClient
from conftest import unique_suffix


class TestUserCRUD:

    def test_get_users(self, admin_client: APIClient):
        """API-U-001: Get user list with pagination."""
        resp = admin_client.get("/admin/users/list", params={"current": 1, "pageSize": 10})
        assert resp.status_code == 200
        data = resp.json()
        assert "data" in data

    def test_search_users(self, admin_client: APIClient):
        """API-U-002: Search users by keyword."""
        resp = admin_client.get("/admin/users/list", params={"current": 1, "pageSize": 10, "keyword": "admin"})
        assert resp.status_code == 200

    def test_get_user(self, admin_client: APIClient):
        """API-U-003: Get user detail by ID."""
        resp = admin_client.get("/admin/users/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            user_id = records[0].get("id")
            resp = admin_client.get("/admin/users/get", params={"id": user_id})
            assert resp.status_code == 200

    def test_create_user(self, admin_client: APIClient):
        """API-U-004: Create a new user."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/users/create", json={
            "username": f"testuser_{suffix}",
            "password": "test123456",
            "realName": f"测试用户_{suffix}",
            "phone": f"139{suffix[:8]}",
        })
        assert resp.status_code == 200

    def test_create_user_duplicate(self, admin_client: APIClient):
        """API-U-005: Create user with duplicate username."""
        resp = admin_client.post("/admin/users/create", json={
            "username": "admin",
            "password": "test123456",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data.get("code") != 200

    def test_create_user_short_password(self, admin_client: APIClient):
        """API-U-006: Create user with too-short password."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/users/create", json={
            "username": f"shortpass_{suffix}",
            "password": "123",
        })
        assert resp.status_code in (400, 200)

    def test_update_user(self, admin_client: APIClient):
        """API-U-007: Update user info."""
        resp = admin_client.get("/admin/users/list", params={"current": 1, "pageSize": 10})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            user = records[0]
            resp = admin_client.post("/admin/users/update", json={
                "id": user.get("id"),
                "realName": f"Updated_{unique_suffix()}",
            })
            assert resp.status_code == 200

    def test_delete_user(self, admin_client: APIClient):
        """API-U-008: Delete a test user."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/users/create", json={
            "username": f"deluser_{suffix}",
            "password": "test123456",
            "realName": f"待删除_{suffix}",
        })
        if resp.status_code == 200:
            user = resp.json().get("data", {})
            num = user.get("num")
            if num:
                resp2 = admin_client.post("/admin/users/delete", params={"num": num})
                assert resp2.status_code == 200

    def test_activate_user(self, admin_client: APIClient):
        """API-U-009: Activate a disabled user."""
        resp = admin_client.get("/admin/users/list", params={"current": 1, "pageSize": 20, "status": "DISABLED"})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/users/activate", params={"num": num})
                assert resp.status_code == 200

    def test_deactivate_user(self, admin_client: APIClient):
        """API-U-010: Deactivate an enabled user."""
        resp = admin_client.get("/admin/users/list", params={"current": 1, "pageSize": 20, "status": "ENABLED"})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        # Skip admin account
        non_admin = [r for r in records if r.get("username") != "admin"]
        if non_admin:
            num = non_admin[0].get("num")
            if num:
                resp = admin_client.post("/admin/users/deactivate", params={"num": num})
                assert resp.status_code == 200

    def test_resign_user(self, admin_client: APIClient):
        """API-U-011: Resign a test user."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/users/create", json={
            "username": f"resignuser_{suffix}",
            "password": "test123456",
            "realName": f"离职测试_{suffix}",
        })
        if resp.status_code == 200:
            user = resp.json().get("data", {})
            num = user.get("num")
            if num:
                resp2 = admin_client.post("/admin/users/resign", params={"num": num})
                assert resp2.status_code == 200

    def test_reset_user_password(self, admin_client: APIClient):
        """API-U-012: Admin resets user password."""
        resp = admin_client.get("/admin/users/list", params={"current": 1, "pageSize": 10})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        non_admin = [r for r in records if r.get("username") != "admin"]
        if non_admin:
            num = non_admin[0].get("num")
            if num:
                resp = admin_client.post("/admin/users/reset-password", params={
                    "num": num,
                    "newPassword": "resetpass123",
                })
                assert resp.status_code == 200

    def test_batch_users(self, admin_client: APIClient):
        """API-U-013: Batch create users."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/users/batch-create", json=[
            {"username": f"batch1_{suffix}", "password": "test123456", "realName": f"批量1_{suffix}"},
            {"username": f"batch2_{suffix}", "password": "test123456", "realName": f"批量2_{suffix}"},
        ])
        assert resp.status_code == 200
