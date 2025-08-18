from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from crud import get_user_by_email
from schemas import LoginRequest
from core.security import verify_password, create_access_token, get_current_user
from core.config import settings


router = APIRouter(
    prefix = "/auth",
    tags = ["auth"]
)

@router.get("/protected")
def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Bienvenue {current_user} !"}

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    if not user :
        raise HTTPException(status_code = 401, detail = "Identifiants incorrects.")
    
    # Vérifier si le compte est vérouillé
    if user.lock_until and datetime.now() < user.lock_until:
        remaining = int((user.lock_until - datetime.now()).total_seconds() // 60)
        raise HTTPException(status_code=403, detail = f'Trop de tentatives. Réessayez dans {remaining} minutes.')

    # Vérifier le mot de passe
    if not verify_password(request.password, user.password):
        user.failed_attempts += 1
        if user.failed_attempts >= settings.MAX_ATTEMPTS:
            user.lock_until = datetime.now() + settings.LOCK_TIME
            user.failed_attempts = 0 # on remet à 0 pour repartir après le délai
        db.commit()
        raise HTTPException(status_code = 401, detail = "Identifiants incorrects.")

    # Connexion réussie : on reset le compteur
    user.failed_attempts = 0
    user.lock_until = None
    db.commit()

    # Création du JWT
    access_token = create_access_token({"sub": user.email})

    # Réponse avec cookie HTTPOnly
    response = JSONResponse(content={"success": True})
    response.set_cookie(
        key = "access_token",
        value=access_token,
        httponly=True,
        secure=False, # True en prod avec HTTPS
        samesite="strict",
        max_age = 3600 # 30 minutes
    )

    return response
