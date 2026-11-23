import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)



def test_users_me_without_token():
    response = client.get("/api/users/me/")
    assert response.status_code == 401


def test_stats_answer_without_token():
    response = client.post("/api/stats/answer",  json={"correct": True})
    assert response.status_code == 401


def test_users_me_with_garbage_token():
    response = client.get(
        "/api/users/me/",
        headers={"Authorization": "Bearer not_a_valid_token"},
    )
    assert response.status_code == 401


def test_stats_answer_with_garbage_token():
    response = client.post(
        "/api/stats/answer",
        json={"correct": True},
        headers={"Authorization": "Bearer not_a_valid_token"},
    )
    assert response.status_code == 401