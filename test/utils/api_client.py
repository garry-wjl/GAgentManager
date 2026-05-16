"""API client wrapper for test automation."""

import requests
from config import BASE_URL


class APIClient:
    """Thin wrapper around requests.Session with base URL and token management."""

    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.token: str | None = None

    def set_token(self, token: str) -> None:
        self.token = token
        self.session.headers.update({"Authorization": f"Bearer {token}"})

    def clear_token(self) -> None:
        self.token = None
        self.session.headers.pop("Authorization", None)

    def _url(self, path: str) -> str:
        return f"{self.base_url}{path}"

    def get(self, path: str, **kwargs) -> requests.Response:
        return self.session.get(self._url(path), **kwargs)

    def post(self, path: str, json=None, **kwargs) -> requests.Response:
        return self.session.post(self._url(path), json=json, **kwargs)

    def put(self, path: str, json=None, **kwargs) -> requests.Response:
        return self.session.put(self._url(path), json=json, **kwargs)

    def delete(self, path: str, **kwargs) -> requests.Response:
        return self.session.delete(self._url(path), **kwargs)
