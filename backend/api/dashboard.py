from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from core.security import get_current_user
from database import get_db
from crud import get_projects_by_user
from models import User, Project, Annotation
import os
from sqlalchemy import func
from pathlib import Path
from charset_normalizer import from_path
import csv
import io

router = APIRouter(
    prefix="/dashboard",
    tags = ["dasboard"]
)

@router.get("/")
def get_user_projects(current_user : User = Depends(get_current_user), db: Session = Depends(get_db)):
    projects = get_projects_by_user(db, current_user.id)
    if not projects:
        return {"has_projects": False, "projects": []}
    
    project_list = []
    for project in projects:
        total_rows = db.query(func.count(Annotation.id)).filter(Annotation.project_id == project.id).scalar()
        annotated_rows = db.query(func.count(Annotation.id)).filter(
            Annotation.project_id == project.id,
            Annotation.content.isnot(None)
        ).scalar()

        completion = 0
        if total_rows > 0:
            completion = round((annotated_rows / total_rows) * 100)

        if completion == 100 and project.status == "pending":
            project.status = "completed"
            db.commit()
            db.refresh(project)

        project_list.append({
            "id": project.id,
            "project_name": project.project_name,
            "due_date": project.due_date,
            "status": project.status,
            "completion": completion
        })

    return {"has_projects": True, "projects": project_list}




@router.delete("/annotations/{project_id}")
def delete_user_project(project_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Récupérer le projet
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")

    # Supprimer les fichiers stockés
    for file_path in [project.annotation_file_path, project.guidelines_file_path]:
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Erreur lors de la suppression du fichier: {e}")

    # Supprimer le projet dans la base
    db.delete(project)
    db.commit()

    return {"message": "Projet supprimé avec succès"}


def generate_csv(project: Project, annotations_by_row: dict[Annotation]):
    # Générer le fichier à exporter
    csv_path = Path(project.annotation_file_path)
    if csv_path.exists():
        result = from_path(csv_path).best()
        if result is None:
            raise HTTPException(status_code=400, detail="Impossible de détecter l'encodage du fichier CSV")
        with open(csv_path, newline="", encoding=result.encoding) as csv_file:
            reader = csv.DictReader(csv_file)

            # New header
            fieldnames = reader.fieldnames + ["annotation", "date"]

            # Créer un fichier en mémoire
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=fieldnames)

            # Ecrire la première ligne et envoyer au client
            writer.writeheader()
            yield output.getvalue()

            # Nettoyer la mémoire
            output.seek(0)
            output.truncate(0)

            for idx, row in enumerate(reader):
                # /!\ row_id commence à 1
                ann = annotations_by_row.get(idx+1)

                row["annotation"] = ann.content if ann else ""
                row["date"] = ann.date if ann else ""

                writer.writerow(row)

                yield output.getvalue()
                output.seek(0)
                output.truncate(0)


@router.get("/annotations/{project_id}/export")
async def export_project(project_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Récupérer le projet
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    # Récupérer toutes les annotations associées
    annotations = db.query(Annotation).filter(Annotation.project_id == project_id).all()

    # Faire un dict pour itérer avec le row_id d'annotations
    annotations_by_row = {
        ann.row_id: ann for ann in annotations
    }

    return StreamingResponse(
        generate_csv(project = project, annotations_by_row=annotations_by_row),
        media_type="text/csv",
        headers={
            "Content-disposition": f"attachement; filename=project_{project_id}export.csv"
        }
    )