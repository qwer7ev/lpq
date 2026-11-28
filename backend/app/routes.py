from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from datetime import timedelta
from typing import Annotated

from app.dependencies import SessionDep, CurrentUserDep
from app.models import Token, UserStats, UserCreate, UserPublic, AnswerEvent
from app import crud, security, config

api = APIRouter(prefix="/api") 

@api.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep) -> Token:
    user = security.authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)
    return Token(access_token=access_token, token_type="bearer")

@api.get("/users/me/")
async def read_users_me(current_user: CurrentUserDep) -> UserStats:
    return current_user

@api.post("/register", status_code=status.HTTP_201_CREATED)
def register_new_user(new_user: UserCreate, session: SessionDep) -> UserPublic:
    if crud.get_user_by_username(session, new_user.username) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken"
        )
    hashed_password = security.get_password_hash(new_user.password)
    user = crud.create_user(session, new_user.username, hashed_password)
    return user

@api.post("/stats/answer", status_code=status.HTTP_204_NO_CONTENT)
def answer_event(answer: AnswerEvent, user: CurrentUserDep, session: SessionDep) -> None:
    if answer.correct:
        user.correct_answers += 1
        user.current_streak += 1
        user.longest_streak = max(user.current_streak, user.longest_streak)
    else:
        user.incorrect_answers += 1
        user.current_streak = 0 
    session.commit()

