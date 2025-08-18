from pydantic_settings import BaseSettings
from datetime import timedelta
from typing import ClassVar

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM : str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES : int = 60
    DATABASE_URL : str
    MAX_ATTEMPTS : int = 5
    LOCK_TIME : ClassVar[timedelta] = timedelta(minutes=60)

settings = Settings()