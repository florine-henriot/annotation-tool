from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import SessionLocal, engine
from models import User, Base
from schemas import LoginRequest, SignupRequest
from crud import get_user_by_email
from utils import hashpassword, verify_password

Base.metadata.create_all(bind=engine)

app = FastAPI()

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
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code = 401, detail = "Identifiants incorrects.")
    
    return {"success": True}


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