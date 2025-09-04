from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import SignupRequest
from core.security import hashpassword
from crud import get_user_by_email

router = APIRouter(
    prefix = "/users",
    tags = ["users"]
)

@router.post("/signup")
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