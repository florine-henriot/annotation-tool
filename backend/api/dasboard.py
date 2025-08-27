from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.security import get_current_user
from database import get_db
from crud import get_projects_by_user
from models import User

router = APIRouter(
    prefix="/dashboard",
    tags = ["dasboard"]
)

@router.get("/")
def get_user_projects(current_user : User = Depends(get_current_user), db: Session = Depends(get_db)):
    projects = get_projects_by_user(db, current_user.id)
    if not projects:
        return {"has_projects": False, "projects": []}
    return {"has_projects": True, "projects": projects}