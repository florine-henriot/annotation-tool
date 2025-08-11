from jose import JWTError, jwt
from fastapi import Cookie, Depends, HTTPException
from datetime import datetime, timedelta
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def get_current_user(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token invalide")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")