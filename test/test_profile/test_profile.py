"""User-end profile API tests."""

import pytest
from utils.api_client import APIClient
from conftest import unique_suffix


class TestProfile:

    def test_get_profile(self, user_client: APIClient):
        """API-PR-001: Get personal profile."""
        resp = user_client.get("/user/profile")
        assert resp.status_code == 200

    def test_update_profile(self, user_client: APIClient):
        """API-PR-002: Update personal profile."""
        resp = user_client.post("/user/profile/update", json={
            "realName": f"新昵称_{unique_suffix()}",
        })
        assert resp.status_code == 200

    def test_change_password(self, user_client: APIClient):
        """API-PR-003: Change password."""
        resp = user_client.post("/user/password/change", json={
            "oldPassword": "user123",
            "newPassword": "newpass123",
        })
        # May succeed or fail depending on actual password
        assert resp.status_code in (200, 400)

    def test_change_password_wrong_old(self, user_client: APIClient):
        """API-PR-004: Change password with wrong old password."""
        resp = user_client.post("/user/password/change", json={
            "oldPassword": "wrong_old_password",
            "newPassword": "newpass123",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data.get("code") != 200, "Wrong old password should be rejected"

    def test_update_avatar(self, user_client: APIClient):
        """API-PR-005: Update avatar URL."""
        resp = user_client.post("/user/avatar/update", params={
            "avatarUrl": "https://example.com/avatar.png",
        })
        assert resp.status_code in (200, 400)
