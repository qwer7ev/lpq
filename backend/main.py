from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel, Field as BaseField
from sqlmodel import select, create_engine, Session, SQLModel, Field as SQLField

# ------ config ------
SECRET_KEY = "363d66661b2f7a9eeb97b242d9f376251a32bb962e6219237c19124c0e336503"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ------ models ------
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

class UserMe(UserPublic):
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

# ------ app setup ------
app = FastAPI()
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_methods=["*"],
	allow_headers=["*"]
)

api = APIRouter(prefix="/api") 

# ------ security objects ------
password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

# ------ database engine ------
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
	SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
	
SessionDep = Annotated[Session, Depends(get_session)]

@app.on_event("startup")
def on_startup():
    create_db_and_tables()



# ------ db helpers ------

def create_user(session: Session, username: str, hashed_password: str) -> User:
	user = User(username=username, hashed_password=hashed_password) 
	session.add(user)
	session.commit()
	session.refresh(user)
	return user

def get_user_by_username(session: Session, username: str) -> User | None:
	return session.exec(select(User).where(User.username == username)).first()

def get_user_by_id(session: Session, user_id: int) -> User | None:
	return session.get(User, user_id)

# ------ security helpers ------
# register
def get_password_hash(password: str) -> str:
    return password_hash.hash(password)

# login
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def authenticate_user(session: Session, username: str ,password: str) -> User | None:
	user = get_user_by_username(session, username)
	if not user:
		return None
	if not verify_password(password, user.hashed_password):
		return None
	return user

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
	to_encode = data.copy()
	if expires_delta is None:
		expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
	expire = datetime.now(UTC) + expires_delta
	to_encode.update({"exp": expire})
	encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
	return encoded_jwt

# ------ dependencies ------
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: SessionDep) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
		)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        if user_id is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    user = get_user_by_id(session, user_id)
    if user is None:
        raise credentials_exception
    return user
	
# ------ routes ------
@api.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep) -> Token:
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)
    return Token(access_token=access_token, token_type="bearer")

@api.get("/users/me/")
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]) -> UserMe:
    return current_user

@api.post("/register", status_code=201)
def register_new_user(new_user: UserCreate, session: SessionDep) -> UserPublic:
	if get_user_by_username(session, new_user.username) is not None:
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="Username already taken"
		)
	hashed_password = get_password_hash(new_user.password)
	user = create_user(session, new_user.username, hashed_password)
	return user

@api.post("/stats/answer", status_code=status.HTTP_204_NO_CONTENT)
def answer_event(answer: AnswerEvent, user: Annotated[User, Depends(get_current_user)], session: SessionDep) -> None:
	if answer.correct:
		user.correct_answers += 1
		user.current_streak += 1
		user.longest_streak = max(user.current_streak, user.longest_streak)
	else:
		user.incorrect_answers += 1
		user.current_streak = 0 
	session.commit()

# attach route to app
app.include_router(api)