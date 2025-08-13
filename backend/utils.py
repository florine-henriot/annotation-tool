from passlib.context import CryptContext
from jose import jwt
import os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("SECRET_KEY")
print(SECRET_KEY)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES = 720

pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

def hashpassword(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRES))
    to_encode.update({"exp": expire})
    print(f"SECRET_KEY type: {type(SECRET_KEY)}, value: {SECRET_KEY}")
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)