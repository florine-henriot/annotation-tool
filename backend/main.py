from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from datetime import datetime, timedelta

from database import SessionLocal, engine
from models import User, Base
from schemas import LoginRequest, SignupRequest
from crud import get_user_by_email
from utils import hashpassword, verify_password, create_access_token
from auth import get_current_user

Base.metadata.create_all(bind=engine)

MAX_ATTEMPTS = 5
LOCK_TIME = timedelta(minutes=60)

app = FastAPI()

# Middleware pour les headers de sécurité
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)

    # Content Security Policy (CSP)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000; "
        "style-src 'self' 'unsafe-inline' http://localhost:3000; "
        "img-src 'self' data:; "
        "connect-src 'self' http://localhost:3000 http://localhost:8000 ws://localhost:3000; "
        "font-src 'self' data:; "
        "frame-src 'self';"
    )

    # Autres headers de sécurité
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

    return response

# Configuration CORS pour le frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # autorise le frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dépendance pour obtenir une sessions DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/login")
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
        if user.failed_attempts >= MAX_ATTEMPTS:
            user.lock_until = datetime.now() + LOCK_TIME
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
        max_age = 1800 # 30 minutes
    )

    return response


@app.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    if user:
        raise HTTPException(status_code=400, detail = "Un utilisateur avec cet email existe déjà.")
    
    new_user = User(
        first_name = request.first_name,
        last_name = request.last_name,
        email = request.email,
        password = hashpassword(request.password),
        company = request.company
    )
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail = "Erreur lors de la création de l'utilisateur.")
    return {"success": True}

@app.get("/protected")
def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Bienvenue {current_user} !"}