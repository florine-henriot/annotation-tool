from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Project, Annotation
from core.security import get_current_user
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
    current_user: dict = Depends(get_current_user)
):
    """Créé un nouveau projet pour un utilisateur:
        - créer un projet avec les métadonnées nom, date limite, catégories, notes
        - sauvegarder les fichiers uploadés (annotations (obligatoire), guidelines (facultatif))
        - parser le fichier CSV d'annotation
        - créer les entrées d'annotations en base de données

    Args:
        project_name (str, optional): nom du projet. Defaults to Form(...).
        due_date (str, optional): date limite du projet. Defaults to Form(...).
        categories (str, optional): liste des catégories séparées par des virgules. Defaults to Form(...).
        notes (str, optional): notes associées au projet. Defaults to Form(None).
        annotation_file (UploadFile, optional): fichier csv d'annotation. Defaults to File(...).
        guidelines_file (UploadFile, optional): fichier pdf de guidelines. Defaults to File(None).
        db (Session, optional): session sqlalchemy. Defaults to Depends(get_db).
        current_user (dict, optional): utilisateur authentifié. Defaults to Depends(get_current_user).

    Raises:
        HTTPException: si le format de la date est invalide
        HTTPException: si l'encodage du csv ne peut pas être détecté

    Returns:
        dict: message de confirmation et identifiant du projet
    """    

    # Sauvegarde du fichier d'annotations
    annotation_file_path = None
    if annotation_file:
        annotation_file_path = os.path.join(UPLOAD_DIR, annotation_file.filename)
        with open(annotation_file_path, "wb") as buffer:
            shutil.copyfileobj(annotation_file.file, buffer)

    # Sauvegarde du fichier guidelines si fournis
    guidelines_file_path = None
    if guidelines_file:
        guidelines_file_path = os.path.join(UPLOAD_DIR, guidelines_file.filename)
        with open(guidelines_file_path, "wb") as buffer:
            shutil.copyfileobj(guidelines_file.file, buffer)

    # Validation et conversion de la date limite
    try:
        due_date_obj = datetime.strptime(due_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Format de date invalide")
    
    # transforme les catégories données en liste
    category_list = [c.strip() for c in categories.split(',')] if categories else []

    # Création du projet en base de données
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
    
    # Conversion de l'encodage en utf 8
    utf8_text = result.output().decode('utf-8', errors="replace")

    # parsing et création des annotations en base de données
    lines = utf8_text.splitlines()
    reader = csv.reader(lines)

    for row_id, row in enumerate(reader):
        print(row_id, row)
        if row_id==0:
            continue
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
    """Récupère les détails d'un projet appartenant à un utilisateur spécifique.
        - vérifier que le projet existe et appartient à l'utilisateur actuel
        - récupérer les annotations associées au projet
        - calculer le taux de complétion du projet
        - calculer et stocker la moyenne d'annotations par jour une fois le projet terminé
        - renvoyer les métadonnées du projet et la liste d'annotations

    Args:
        project_id (int): identifiant du projet à récupérer
        db (Session, optional): session sqlalchemy. Defaults to Depends(get_db).
        current_user (dict, optional): utilisateur authentifié. Defaults to Depends(get_current_user).

    Raises:
        HTTPException: si le projet n'existe pas ou n'appartient pas à l'utilisateur

    Returns:
        dict: informations sur le projet, les statistiques et les annotations
    """    

    # Vérifier que le projet existe
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")

    # Récupérer toutes les annotations associées
    annotations = db.query(Annotation).filter(Annotation.project_id == project_id).all()

    # Calcul du taux de complétion du projet
    total = len(annotations)
    done = sum(1 for a in annotations if a.content is not None)
    completion = round((done / total * 100), 2) if total > 0 else 0

    # si projet terminé et rien en base de données, calcul du nombre moyen d'annotations
    if project.status == "completed" and not project.mean_annotations:
        # nombre total d'annotations
        total_annotations = sum(1 for a in annotations if getattr(a, "content", None))
        # date des annotations
        annotated_dates = [a.date for a in annotations if getattr(a, "date", None)]
        # date de début effective des annotations
        if annotated_dates:
            first_date = min(annotated_dates)
        else:
            first_date = datetime.utcnow()
        # nombre de jour écoulés depuis (1 minimum pour éviter la division par 0)
        days_elapsed = max(
            (datetime.utcnow() - first_date).total_seconds() / 86400,
            1
        )
        # calcul et sauvegarde de la moyenne
        project.mean_annotations = round(total_annotations / days_elapsed)
        db.commit()
        db.refresh(project)

    return {
        "id": project.id,
        "project_name": project.project_name,
        "due_date": project.due_date,
        "notes": project.notes,
        "guidelines_file_path": project.guidelines_file_path,
        "categories": project.categories,
        "completion": completion,
        "status": project.status,
        "mean_annotations": project.mean_annotations,
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
    """Récupère les annotations d'un projet avec le texte source associé.
    Cette route destinée à l'interface d'annotation permet : 
        - vérifier que le projet existe et appartient à l'utilisateur authentifié
        - récupérer les annotations du projet dans l'ordre du fichier source
        - lire le fichier csv d'origine pour associer chaque annotation à son texte
        - retourner les métadonnées du projet et les annotations enrichies du texte à annoter

    Args:
        project_id (int): identifiant du projet à annoter
        db (Session, optional): session sqlalchemy. Defaults to Depends(get_db).
        current_user (dict, optional): utilisateur authentifié. Defaults to Depends(get_current_user).

    Raises:
        HTTPException 404: le projet n'existe pas ou n'appartient pas à l'utilisateur authentifié
        HTTPException 400: l'encodage du csv n'a pas pu être détecté

    Returns:
        dict: les informations du projet, les annotations et le texte source
    """    

    # Vérifier que le projet existe
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")

    # Récupérer toutes les annotations associées
    annotations = db.query(Annotation).filter(Annotation.project_id == project_id).order_by(Annotation.row_id.asc()).all()

    # Lecture CSV pour voir le texte
    texts = {}
    csv_path = Path(project.annotation_file_path)
    if csv_path.exists():
        # détection de l'encodage
        result = from_path(csv_path).best()
        if result is None:
            raise HTTPException(status_code=400, detail="Impossible de détecter l'encodage du fichier CSV")
        with open(csv_path, newline="", encoding=result.encoding) as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for idx, row in enumerate(csv_reader):
                # idx+1 to skip header and have database and file correspond
                texts[idx+1] = row.get("text", "fail")

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
                "text": texts.get(a.row_id, "")
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
    """Met à jour le contenu d'une annotation pour un projet donné.
    Cette route est utilisée lors de la soumission d'une annotation depuis l'interface utilisateur.
        - vérifier que le projet appartient à l'utilisateur authentifié
        - vérufuer que l'annotation ciblée existe et est associée au projet
        - enregistrer la catégorie choisie et la date d'annotation
        - mise à jour en base de données

    Args:
        project_id (int): identifiant du projet
        payload (AnnotationSubmit): données envoyées par le front. Contient : 
            - annotationID : identifiant de l'annotation à mettre à jour
            - category : valeur de l'annotation
            - date : date de validation de l'annotation
        db (_type_, optional): session sqlalchemy. Defaults to Depends(get_db).
        current_user (_type_, optional): utilisateur authentifié. Defaults to Depends(get_current_user).

    Raises:
        HTTPException: le projet n'existe pas ou appartient à un autre utilisateur
        HTTPException: l'annotation n'existe pas ou n'est pas liée au projet

    Returns:
        dict: message de confirmation et identifiant de l'annotation mise à jour
    """    

    # Vérifier que le projet appartient à l'utilisateur
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    
    # Récupérer l'annotation à mettre à jour
    annotation = db.query(Annotation).filter(Annotation.id == payload.annotationId, Annotation.project_id == project_id).first()
    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation non trouvée")
    
    # mettre à jour l'annotation
    annotation.content = payload.category
    annotation.date = payload.date

    db.commit()
    db.refresh(annotation)

    return {"message": "Annotation enregistrée", "annotation_id": annotation.id}