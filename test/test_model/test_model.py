"""Model management API tests."""

import pytest
from utils.api_client import APIClient
from conftest import unique_suffix


class TestModel:

    def test_get_models(self, admin_client: APIClient):
        """API-MD-001: Get model list."""
        resp = admin_client.get("/admin/models/list", params={"current": 1, "pageSize": 10})
        assert resp.status_code == 200

    def test_create_model(self, admin_client: APIClient):
        """API-MD-002: Register a new model."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/models/create", json={
            "modelCode": f"gpt_test_{suffix}",
            "modelName": f"gpt-test-{suffix}",
            "provider": "OpenAI",
            "apiType": "openai",
            "baseUrl": "https://api.openai.com/v1",
            "apiKey": "sk-test-xxx",
            "capabilities": ["chat", "completion"],
        })
        assert resp.status_code == 200

    def test_update_model(self, admin_client: APIClient):
        """API-MD-003: Update a model."""
        resp = admin_client.get("/admin/models/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            model = records[0]
            resp = admin_client.post("/admin/models/update", json={
                "id": model.get("id"),
                "num": model.get("num"),
                "modelName": f"Updated_{unique_suffix()}",
            })
            assert resp.status_code == 200

    def test_delete_model(self, admin_client: APIClient):
        """API-MD-004: Delete a model."""
        suffix = unique_suffix()
        resp = admin_client.post("/admin/models/create", json={
            "modelCode": f"del_model_{suffix}",
            "modelName": f"待删除模型_{suffix}",
            "provider": "TestProvider",
            "apiType": "openai",
            "baseUrl": "https://api.test.com/v1",
            "apiKey": "sk-test-del",
        })
        if resp.status_code == 200:
            model = resp.json().get("data", {})
            num = model.get("num")
            if num:
                resp2 = admin_client.post("/admin/models/delete", params={"num": num})
                assert resp2.status_code == 200

    def test_enable_model(self, admin_client: APIClient):
        """API-MD-005: Enable a disabled model."""
        resp = admin_client.get("/admin/models/list", params={"current": 1, "pageSize": 20, "status": "DISABLED"})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/models/enable", params={"num": num})
                assert resp.status_code == 200

    def test_disable_model(self, admin_client: APIClient):
        """API-MD-006: Disable an enabled model."""
        resp = admin_client.get("/admin/models/list", params={"current": 1, "pageSize": 20, "status": "ENABLED"})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/models/disable", params={"num": num})
                assert resp.status_code == 200

    def test_model_connection(self, admin_client: APIClient):
        """API-MD-007: Test model connectivity."""
        resp = admin_client.get("/admin/models/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            num = records[0].get("num")
            if num:
                resp = admin_client.post("/admin/models/test", params={"num": num})
                assert resp.status_code == 200

    def test_get_model_monitoring(self, admin_client: APIClient):
        """API-MD-008: Get model monitoring data."""
        resp = admin_client.get("/admin/models/list", params={"current": 1, "pageSize": 1})
        assert resp.status_code == 200
        data = resp.json()
        records = data.get("data", {}).get("records", [])
        if records:
            model_id = records[0].get("id")
            # Check detail endpoint
            resp = admin_client.get("/admin/models/detail", params={"num": records[0].get("num")})
            assert resp.status_code == 200
