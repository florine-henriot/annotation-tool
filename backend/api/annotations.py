from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Project, Annotation
from core.security import get_current_user  # ta fonction JWT pour récupérer l'utilisateur
import shutil
import os
import csv
from charset_normalizer import from_bytes
from datetime import datetime

router = APIRouter(
    prefix="/annotations",
    tags=["annotations"]
)

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/create")
async def create_project(
    project_name: str = Form(...),
    due_date: str = Form(...),
    categories: str = Form(...),
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
    
    category_list = [c.strip() for c in categories.split(',')] if categories else []

    # Création du projet
    new_project = Project(
        user_id=current_user.id,
        project_name=project_name,
        due_date=due_date_obj,
        notes=notes,
        annotation_file_path=annotation_file_path,
        guidelines_file_path=guidelines_file_path,
        status="pending",
        categories = category_list
    )

    db.add(new_project)
    db.commit()

    # Lire le CSV uploadé d'annotations
    annotation_file.file.seek(0)
    contents = await annotation_file.read()

    # Détection de l'encodage
    result = from_bytes(contents).best()
    if result is None:
        raise HTTPException(status_code=400, detail="Impossible de détecter l'encodage du fichier")
    utf8_text = result.output().decode('utf-8', errors="replace")

    # Lire le CSV
    lines = utf8_text.splitlines()
    reader = csv.reader(lines)

    for row_id, row in enumerate(reader):
        annotation = Annotation(
            row_id = row_id,
            project_id = new_project.id,
            content = None,
            date = None
        )
        db.add(annotation)

    db.commit()

    return {"message": "Projet créé avec succès", "project": new_project.id}


@router.get("/{project_id}")
def get_project_details(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Vérifier que le projet existe
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")

    # Récupérer toutes les annotations associées
    annotations = db.query(Annotation).filter(Annotation.project_id == project_id).all()

    total = len(annotations)
    done = sum(1 for a in annotations if a.content is not None)
    completion = round((done / total * 100), 2) if total > 0 else 0

    return {
        "id": project.id,
        "project_name": project.project_name,
        "due_date": project.due_date,
        "notes": project.notes,
        "guidelines_file_path": project.guidelines_file_path,
        "categories": project.categories,
        "completion": completion,
        "annotations": [
            {
                "id": a.id,
                "row_id": a.row_id,
                "content": a.content,
                "date": a.date
            }
            for a in annotations
        ]
    }