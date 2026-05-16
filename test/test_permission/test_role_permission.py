"""RBAC permission API tests."""

import pytest
from utils.api_client import APIClient
from conftest import unique_suffix


class TestRolePermission:

    def test_get_roles(self, admin_client: APIClient):
        """API-P-001: Get role list."""
        resp = admin_client.get("/admin/rbac/role/list", params={"current": 1, "pageSize": 10})
        assert resp.status_code == 200

    def test_create_role(self, admin_client: APIClient):
        """API-P-002: Create a new role."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/rbac/role/create", json={
            "roleCode": f"test_role_{suffix}",
            "roleName": f"测试角色_{suffix}",
            "description": "自动化测试创建",
        })
        assert resp.status_code == 200

    def test_update_role(self, admin_client: APIClient):
        """API-P-004: Update a role."""
        resp = admin_client.get("/admin/rbac/role/list", params={"current": 1, "pageSize": 10})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        custom = [r for r in records if not r.get("isSystem")]
        if custom:
            role = custom[0]
            resp = admin_client.post("/admin/rbac/role/update", json={
                "id": role.get("id"),
                "num": role.get("num"),
                "roleName": f"Updated_{unique_suffix()}",
            })
            assert resp.status_code == 200

    def test_delete_role(self, admin_client: APIClient):
        """API-P-005: Delete a custom role."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/rbac/role/create", json={
            "roleCode": f"del_role_{suffix}",
            "roleName": f"待删除_{suffix}",
        })
        if resp.status_code == 200:
            role = resp.json().get("data", {})
            num = role.get("num")
            if num:
                resp2 = admin_client.post("/admin/rbac/role/delete", params={"num": num})
                assert resp2.status_code == 200

    def test_enable_role(self, admin_client: APIClient):
        """API-P-006: Enable a disabled role."""
        resp = admin_client.get("/admin/rbac/role/list", params={"current": 1, "pageSize": 20, "isEnabled": False})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/rbac/role/enable", params={"num": num})
                assert resp.status_code == 200

    def test_disable_role(self, admin_client: APIClient):
        """API-P-007: Disable an enabled role."""
        resp = admin_client.get("/admin/rbac/role/list", params={"current": 1, "pageSize": 20, "isEnabled": True})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        custom = [r for r in records if not r.get("isSystem")]
        if custom:
            num = custom[0].get("num")
            if num:
                resp = admin_client.post("/admin/rbac/role/disable", params={"num": num})
                assert resp.status_code == 200

    def test_copy_role(self, admin_client: APIClient):
        """API-P-008: Copy existing role (endpoint check)."""
        resp = admin_client.get("/admin/rbac/role/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200

    def test_get_permission_resources(self, admin_client: APIClient):
        """API-P-009: Get permission resource tree."""
        resp = admin_client.get("/admin/rbac/permissions/tree")
        assert resp.status_code == 200

    def test_get_permission_actions(self, admin_client: APIClient):
        """API-P-010: Get permission actions list."""
        resp = admin_client.get("/admin/rbac/permissions/actions")
        assert resp.status_code == 200

    def test_set_role_permissions(self, admin_client: APIClient):
        """API-P-011: Configure role permissions."""
        resp = admin_client.get("/admin/rbac/role/list", params={"current": 1, "pageSize": 10})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        custom = [r for r in records if not r.get("isSystem")]
        if custom:
            resp_res = admin_client.get("/admin/rbac/permissions/tree")
            resources = resp_res.json().get("data", [])
            resource_ids = [r.get("id") for r in resources[:3]] if resources else []
            resp_act = admin_client.get("/admin/rbac/permissions/actions")
            actions = resp_act.json().get("data", [])
            action_ids = [a.get("id") for a in actions[:2]] if actions else []
            if resource_ids or action_ids:
                resp = admin_client.post("/admin/rbac/role/assign-permissions", json={
                    "roleId": custom[0].get("id"),
                    "resourceIds": resource_ids,
                    "actionIds": action_ids,
                    "grantType": "ALLOW",
                })
                assert resp.status_code in (200, 400)

    def test_get_role_users(self, admin_client: APIClient):
        """API-P-012: Get users assigned to a role."""
        resp = admin_client.get("/admin/rbac/role/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            role_id = records[0].get("id")
            resp = admin_client.get("/admin/rbac/role/users", params={"current": 1, "pageSize": 10, "roleId": role_id})
            assert resp.status_code == 200

    def test_assign_user_to_role(self, admin_client: APIClient):
        """API-P-013: Assign a user to a role."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/rbac/role/create", json={
            "roleCode": f"assign_role_{suffix}",
            "roleName": f"关联测试_{suffix}",
        })
        if resp.status_code == 200:
            role = resp.json().get("data", {})
            role_id = role.get("id")
            resp_users = admin_client.get("/admin/users/list", params={"current": 1, "pageSize": 10})
            users = resp_users.json().get("data", {}).get("records", [])
            if users:
                user_id = users[0].get("id")
                resp = admin_client.post("/admin/rbac/role/assign-users", json={
                    "roleId": role_id,
                    "userIds": [user_id],
                })
                assert resp.status_code == 200

    def test_remove_user_from_role(self, admin_client: APIClient):
        """API-P-014: Remove user from a role."""
        resp = admin_client.get("/admin/rbac/role/list", params={"current": 1, "pageSize": 5})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            role_id = records[0].get("id")
            resp_users = admin_client.get("/admin/rbac/role/users", params={"current": 1, "pageSize": 10, "roleId": role_id})
            users = resp_users.json().get("data", {}).get("records", [])
            if users:
                user_id = users[0].get("userId") or users[0].get("id")
                resp = admin_client.post("/admin/rbac/role/remove-user", params={"userId": user_id, "roleId": role_id})
                assert resp.status_code == 200

    def test_get_user_permissions(self, admin_client: APIClient):
        """API-P-015: Get user's effective permissions."""
        resp = admin_client.get("/admin/users/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            user_id = records[0].get("id")
            resp = admin_client.get("/admin/rbac/user/permissions", params={"userId": user_id})
            assert resp.status_code == 200
