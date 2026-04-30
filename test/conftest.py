"""Shared pytest fixtures."""

import pytest
import time
import random
from utils.api_client import APIClient
from config import BASE_URL, ADMIN_ACCOUNT, ADMIN_PASSWORD, USER_ACCOUNT, USER_PASSWORD


@pytest.fixture(scope="session")
def admin_client():
    """Create an admin-authenticated API client for the whole session."""
    client = APIClient(BASE_URL)
    resp = client.post("/auth/login", json={
        "username": ADMIN_ACCOUNT,
        "password": ADMIN_PASSWORD,
    })
    assert resp.status_code == 200, f"Admin login failed: {resp.text}"
    data = resp.json()
    token = data.get("data", {}).get("accessToken") or data.get("data", {}).get("token")
    assert token, f"No token in login response: {data}"
    client.set_token(token)
    return client


@pytest.fixture(scope="session")
def user_client():
    """Create a regular-user-authenticated API client for the whole session."""
    client = APIClient(BASE_URL)
    resp = client.post("/auth/login", json={
        "username": USER_ACCOUNT,
        "password": USER_PASSWORD,
    })
    assert resp.status_code == 200, f"User login failed: {resp.text}"
    data = resp.json()
    token = data.get("data", {}).get("accessToken") or data.get("data", {}).get("token")
    assert token, f"No token in login response: {data}"
    client.set_token(token)
    return client


@pytest.fixture()
def anon_client():
    """Create an unauthenticated API client (no token)."""
    return APIClient(BASE_URL)


def unique_suffix() -> str:
    """Generate a short unique suffix for test data."""
    return f"{int(time.time())}-{random.randint(100, 999)}"
