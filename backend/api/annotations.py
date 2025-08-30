from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Project
from core.security import get_current_user  # ta fonction JWT pour récupérer l'utilisateur
import shutil
import os
from datetime import datetime

router = APIRouter(
    prefix="/annotations",
    tags=["annotations"]
)

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/create")
def create_project(
    project_name: str = Form(...),
    due_date: str = Form(...),
    notes: str = Form(None),
    annotation_file: UploadFile = File(...),
    guidelines_file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)  # récupère l'id user via ton JWT
):
    # Sauvegarde des fichiers si fournis
    annotation_file_path = None
    if annotation_file:
        annotation_file_path = os.path.join(UPLOAD_DIR, annotation_file.filename)
        with open(annotation_file_path, "wb") as buffer:
            shutil.copyfileobj(annotation_file.file, buffer)

    guidelines_file_path = None
    if guidelines_file:
        guidelines_file_path = os.path.join(UPLOAD_DIR, guidelines_file.filename)
        with open(guidelines_file_path, "wb") as buffer:
            shutil.copyfileobj(guidelines_file.file, buffer)

    try:
        due_date_obj = datetime.strptime(due_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Format de date invalide")

    # Création du projet
    new_project = Project(
        user_id=current_user.id,
        project_name=project_name,
        due_date=due_date_obj,
        notes=notes,
        annotation_file_path=annotation_file_path,
        guidelines_file_path=guidelines_file_path,
        status="pending"
    )

    db.add(new_project)
    db.commit()

    return {"message": "Projet créé avec succès", "project": new_project.id}