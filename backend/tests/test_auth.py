from datetime import timedelta

import pytest
from fastapi.testclient import TestClient

from main import app, fake_users_db, create_access_token

client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_db():
    fake_users_db.clear()   # empty the dict before every test (in place, don't rebind it)


def register(username="alice", password="secret123"):
    return client.post("/api/register", json={"username": username, "password": password})


def login(username="alice", password="secret123"):
    return client.post("/api/login", data={"username": username, "password": password})


def auth_header(token):
    return {"Authorization": f"Bearer {token}"}


def test_register_returns_public_user():
    res = register()
    assert res.status_code == 201
    assert res.json() == {"username": "alice"}   # no password or hash leaked


def test_register_login_me():
    register()
    res = login()
    assert res.status_code == 200
    token = res.json()["access_token"]

    res = client.get("/api/users/me", headers=auth_header(token))
    assert res.status_code == 200
    assert res.json()["username"] == "alice"


def test_duplicate_username():
    register()
    assert register().status_code == 409


def test_register_validation():
    assert register(password="short").status_code == 422


def test_wrong_password():
    register()
    assert login(password="wrong").status_code == 401


def test_unknown_user():
    assert login(username="nobody").status_code == 401


def test_no_token():
    assert client.get("/api/users/me").status_code == 401


def test_tampered_token():
    register()
    token = login().json()["access_token"]
    bad = token[:-2] + "xx"   # break the signature
    res = client.get("/api/users/me", headers=auth_header(bad))
    assert res.status_code == 401


def test_expired_token():
    register()
    token = create_access_token({"sub": "alice"}, timedelta(seconds=-1))
    res = client.get("/api/users/me", headers=auth_header(token))
    assert res.status_code == 401