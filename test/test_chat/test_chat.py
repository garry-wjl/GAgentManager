"""User-end chat API tests."""

import pytest
from utils.api_client import APIClient
from conftest import unique_suffix


class TestChat:

    def test_get_sessions(self, user_client: APIClient):
        """API-C-001: Get session list."""
        resp = user_client.get("/chat/session/list")
        assert resp.status_code == 200

    def test_create_session(self, user_client: APIClient):
        """API-C-002: Create a new session."""
        resp = user_client.post("/chat/session/create", json={
            "agentId": 1,
            "sessionTitle": f"测试会话_{unique_suffix()}",
        })
        assert resp.status_code == 200
        data = resp.json()
        session = data.get("data", {})
        return session.get("id") or session.get("sessionId")

    def test_update_session(self, user_client: APIClient):
        """API-C-003: Rename a session."""
        resp = user_client.post("/chat/session/create", json={
            "agentId": 1,
            "sessionTitle": f"待重命名_{unique_suffix()}",
        })
        if resp.status_code == 200:
            session = resp.json().get("data", {})
            num = session.get("num")
            if num:
                resp2 = user_client.post("/chat/session/rename", params={
                    "num": num,
                    "newTitle": f"新标题_{unique_suffix()}",
                })
                assert resp2.status_code == 200

    def test_delete_session(self, user_client: APIClient):
        """API-C-004: Delete a session."""
        resp = user_client.post("/chat/session/create", json={
            "agentId": 1,
            "sessionTitle": f"待删除_{unique_suffix()}",
        })
        if resp.status_code == 200:
            session = resp.json().get("data", {})
            num = session.get("num")
            if num:
                resp2 = user_client.post("/chat/session/delete", params={"num": num})
                assert resp2.status_code == 200

    def test_get_messages(self, user_client: APIClient):
        """API-C-005: Get session message history."""
        resp = user_client.post("/chat/session/create", json={
            "agentId": 1,
            "sessionTitle": f"消息测试_{unique_suffix()}",
        })
        if resp.status_code == 200:
            session = resp.json().get("data", {})
            session_id = session.get("id")
            resp = user_client.get("/chat/message/list", params={
                "current": 1,
                "pageSize": 10,
                "sessionId": session_id,
            })
            assert resp.status_code == 200

    def test_send_message(self, user_client: APIClient):
        """API-C-006: Send a message."""
        resp = user_client.post("/chat/session/create", json={
            "agentId": 1,
            "sessionTitle": f"发消息测试_{unique_suffix()}",
        })
        if resp.status_code == 200:
            session = resp.json().get("data", {})
            session_num = session.get("num")
            if session_num:
                resp = user_client.post("/chat/session/send", json={
                    "sessionNum": session_num,
                    "content": "你好，这是一个自动化测试消息",
                })
                assert resp.status_code == 200

    def test_send_message_with_attachments(self, user_client: APIClient):
        """API-C-007: Send a message with attachments reference."""
        resp = user_client.post("/chat/session/create", json={
            "agentId": 1,
            "sessionTitle": f"附件测试_{unique_suffix()}",
        })
        if resp.status_code == 200:
            session = resp.json().get("data", {})
            session_num = session.get("num")
            if session_num:
                resp = user_client.post("/chat/session/send", json={
                    "sessionNum": session_num,
                    "content": "这是一个带附件的消息",
                    "attachments": [],
                })
                assert resp.status_code == 200

    def test_list_sessions_by_agent(self, user_client: APIClient):
        """API-C-008: List sessions filtered by agent."""
        resp = user_client.get("/chat/session/agent-list", params={"agentId": 1})
        assert resp.status_code == 200
