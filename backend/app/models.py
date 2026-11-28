from pydantic import BaseModel, Field as BaseField
from sqlmodel import SQLModel, Field as SQLField

# ------ pydantic models ------
class AnswerEvent(BaseModel):
    correct: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class UserPublic(BaseModel):
    username: str

class UserCreate(BaseModel):
    username: str = BaseField(min_length=3, max_length=20)
    password: str = BaseField(min_length=8)

class UserStats(UserPublic):
    correct_answers: int
    incorrect_answers: int
    longest_streak: int
    current_streak: int

# ------ sql models ------
class User(SQLModel, table=True):
    id: int | None = SQLField(default=None, primary_key=True)
    username:str = SQLField(unique=True, index=True)
    hashed_password: str
    correct_answers: int = 0
    incorrect_answers: int = SQLField(default=0) 
    longest_streak: int = SQLField(default=0)
    current_streak: int = SQLField(default=0)