"""System configuration API tests."""

import pytest
from utils.api_client import APIClient


class TestSystem:

    def test_get_system_config(self, admin_client: APIClient):
        """API-SYS-001: Get system configuration list."""
        resp = admin_client.get("/admin/configs/list")
        assert resp.status_code == 200

    def test_update_system_config(self, admin_client: APIClient):
        """API-SYS-002: Update a system configuration."""
        # Get existing config first
        resp = admin_client.get("/admin/configs/list")
        assert resp.status_code == 200
        data = resp.json()
        configs = data.get("data", [])
        modifiable = [c for c in configs if c.get("isModifiable")]
        if modifiable:
            config = modifiable[0]
            resp = admin_client.post("/admin/configs/update", json={
                "configKey": config.get("configKey"),
                "configValue": "updated_test_value",
            })
            assert resp.status_code == 200

    def test_get_public_configs(self, admin_client: APIClient):
        """API-SYS-003: Get public configurations."""
        resp = admin_client.get("/admin/configs/public")
        assert resp.status_code == 200

    def test_get_all_configs_as_map(self, admin_client: APIClient):
        """API-SYS-004: Get all configs as key-value map."""
        resp = admin_client.get("/admin/configs/all-as-map")
        assert resp.status_code == 200

    def test_batch_update_config(self, admin_client: APIClient):
        """API-SYS-005: Batch update configurations."""
        resp = admin_client.get("/admin/configs/list")
        assert resp.status_code == 200
        data = resp.json()
        configs = data.get("data", [])
        modifiable = [c for c in configs if c.get("isModifiable")]
        if modifiable:
            resp = admin_client.post("/admin/configs/batch-update", json={
                "configs": [
                    {"configKey": c.get("configKey"), "configValue": f"batch_test_{i}"}
                    for i, c in enumerate(modifiable[:2])
                ]
            })
            assert resp.status_code == 200
