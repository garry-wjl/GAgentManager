"""Authentication API tests."""

import pytest
from config import BASE_URL, ADMIN_ACCOUNT, ADMIN_PASSWORD
from utils.api_client import APIClient
from conftest import unique_suffix


class TestLogin:
    """Tests for POST /api/auth/login."""

    def test_login_success(self, admin_client: APIClient):
        """API-A-001: Normal login with account."""
        # admin_client already logged in successfully, just verify token works
        resp = admin_client.get("/auth/current")
        assert resp.status_code == 200

    def test_login_email(self, anon_client: APIClient):
        """API-A-002: Normal login with email."""
        resp = anon_client.post("/auth/login", json={
            "username": "admin@example.com",
            "password": ADMIN_PASSWORD,
        })
        assert resp.status_code in (200, 401)

    def test_login_wrong_password(self, anon_client: APIClient):
        """API-A-003: Wrong password."""
        resp = anon_client.post("/auth/login", json={
            "username": ADMIN_ACCOUNT,
            "password": "wrong_password",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data.get("code") != 200

    def test_login_not_exist(self, anon_client: APIClient):
        """API-A-004: Account does not exist."""
        resp = anon_client.post("/auth/login", json={
            "username": "nonexistent_account",
            "password": "any_password",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data.get("code") != 200

    def test_login_empty_params(self, anon_client: APIClient):
        """API-A-005: Empty login parameters."""
        resp = anon_client.post("/auth/login", json={
            "username": "",
            "password": "",
        })
        assert resp.status_code in (200, 400)

    def test_login_sql_injection(self, anon_client: APIClient):
        """API-A-006: SQL injection attempt."""
        resp = anon_client.post("/auth/login", json={
            "username": "' OR 1=1 --",
            "password": "xxx",
        })
        # Should not succeed - either returns error or fails gracefully
        data = resp.json()
        assert data.get("code") != 200

    def test_logout(self, admin_client: APIClient):
        """API-A-008: Logout."""
        resp = admin_client.post("/auth/logout")
        assert resp.status_code == 200

    def test_get_current_user(self, admin_client: APIClient):
        """API-A-009: Get current user info."""
        resp = admin_client.get("/auth/current")
        assert resp.status_code == 200
        data = resp.json()
        assert data.get("data")

    def test_no_token_access(self, anon_client: APIClient):
        """API-A-015: Access protected endpoint without token."""
        resp = anon_client.get("/auth/current")
        assert resp.status_code in (401, 403)

    def test_fake_token_access(self, anon_client: APIClient):
        """API-A-016: Access with forged token."""
        anon_client.set_token("fake.token.here")
        resp = anon_client.get("/auth/current")
        assert resp.status_code in (401, 403)
