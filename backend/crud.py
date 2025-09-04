# Définir les fonctions de requêtes en db

from sqlalchemy.orm import Session
from models import User, Project

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_projects_by_user(db: Session, user_id: int):
    return db.query(Project).filter(Project.user_id == user_id).all()