from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.security import get_current_user
from database import get_db
from crud import get_projects_by_user
from models import User, Project
import os

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