from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import SessionLocal, engine
from models import User, Base
from schemas import LoginRequest
from crud import get_user_by_email

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
    if not user or user.password != request.password:
        raise HTTPException(status_code = 401, detail = "Identifiants incorrects.")
    
    return {"success": True}