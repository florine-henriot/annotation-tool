from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Project, Annotation
from core.security import get_current_user  # ta fonction JWT pour récupérer l'utilisateur
import shutil
import os
import csv
from charset_normalizer import from_bytes, from_path
from datetime import datetime
from pathlib import Path
from schemas import AnnotationSubmit

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

@router.get("/{project_id}/annotate")
def get_project_annotations(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Vérifier que le projet existe
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")

    # Récupérer toutes les annotations associées
    annotations = db.query(Annotation).filter(Annotation.project_id == project_id).order_by(Annotation.row_id.asc()).all()

    # Lecture CSV pour voir le texte
    bullet_points_texts = {}
    csv_path = Path(project.annotation_file_path)
    if csv_path.exists():
        result = from_path(csv_path).best()
        if result is None:
            raise HTTPException(status_code=400, detail="Impossible de détecter l'encodage du fichier CSV")
        with open(csv_path, newline="", encoding=result.encoding) as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for idx, row in enumerate(csv_reader):
                bullet_points_texts[idx] = row.get("bullet_point_text", "fail")

    return {
        "id": project.id,
        "project_name": project.project_name,
        "due_date": project.due_date,
        "notes": project.notes,
        "guidelines_file_path": project.guidelines_file_path,
        "categories": project.categories,
        "annotations": [
            {
                "id": a.id,
                "row_id": a.row_id,
                "content": a.content,
                "date": a.date,
                "text": bullet_points_texts.get(a.row_id, "")
            }
            for a in annotations
        ]
    }


@router.post("/{project_id}/submit")
def update_annotations(
    project_id: int,
    payload: AnnotationSubmit,
    db = Depends(get_db),
    current_user = Depends(get_current_user)
) :
    
    # Vérifier que le projet appartient à l'utilisateur
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    
    # Récupérer l'annotation à mettre à jour
    annotation = db.query(Annotation).filter(Annotation.id == payload.annotationId, Annotation.project_id == project_id).first()
    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation non trouvée")
    
    annotation.content = payload.category
    annotation.date = payload.date

    db.commit()
    db.refresh(annotation)

    return {"message": "Annotation enregistrée", "annotation_id": annotation.id}