from sqlmodel import Session, select

from app.models import User

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
