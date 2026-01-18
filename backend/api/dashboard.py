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
def get_user_projects(
    current_user : User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Récupère la liste des projets appartenant à l'utilisateur authentifié.
        - récupérer tous les projets associés à l'utilisateur 
        - calculer le taux de complétion de chaque projet
        - mettre automatiquement à jour le statut d'un projet à completed
        - retourner une vue synthétique des projets dans le tableau de bord utilisateur

    Args:
        current_user (User, optional): utilisateur authentifié. Defaults to Depends(get_current_user).
        db (Session, optional): session sqlalchemy. Defaults to Depends(get_db).

    Returns:
        dict: 
            - has_projects : bool indiquant si l'utilisateur possède des projets
            - projects : liste des projets avec informations principales
    """    

    # Récupérer les projets de l'utilisateur
    projects = get_projects_by_user(db, current_user.id)
    if not projects:
        return {"has_projects": False, "projects": []}
    
    project_list = []
    # Calcul des statistiques pour chaque projet
    for project in projects:
        # nombre total d'annotation du projet
        total_rows = db.query(func.count(Annotation.id)).filter(
            Annotation.project_id == project.id
        ).scalar()
        # nombre d'annotation complétée
        annotated_rows = db.query(func.count(Annotation.id)).filter(
            Annotation.project_id == project.id,
            Annotation.content.isnot(None)
        ).scalar()
        # calcul du taux de complétion
        completion = 0
        if total_rows > 0:
            completion = round((annotated_rows / total_rows) * 100)

        # mise à jour du statut so le projet est terminé
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
def delete_user_project(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Supprime un projet appartenant à l'utilisateur.
        - vérifier que le projet existe et appartient à l'utilisateur
        - supprimer les fichiers associés au projet (annotations et guidelines)
        - supprimer le projet et ses dépendances en base de données

    Args:
        project_id (int): identifiant du projet à supprimer
        current_user (User, optional): utilisateur authentifié. Defaults to Depends(get_current_user).
        db (Session, optional): session sqlalchemy. Defaults to Depends(get_db).

    Raises:
        HTTPException 404: si le projet n'existe pas
        HTTPException 500: si une erreur survient lors de la supression du projet

    Returns:
        dict: message de confirmation
    """    

    # Vérifier et récupérer le projet
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

    # Supprimer le projet dans la base de données
    db.delete(project)
    db.commit()

    return {"message": "Projet supprimé avec succès"}



def generate_csv(
        project: Project, 
        annotations_by_row: dict[Annotation]
):
    """Génère un fichier CSV enrichi avec les annotations du projet.
    Cette fonction lit le fichier CSV d'origine du projet et y ajoute 2 colonnes : 
        - annotation : contenu de l'annotation associé à chaque ligne
        - date : date de validation de l'annotation

    Le CSV est généré sous forme de flux avec un générateur pour faire un envoie
    progressif vers le client (streaming), sans charger l'intégralité du fichier
    en mémoire.

    Args:
        project (Project): projet contenant le chemin vers le fichier CSV d'origine
        annotations_by_row (dict[Annotation]): dictionnaire associant un row_id (index de la ligne
        du csv commençant à 1) à l'object Annotation correspondant.

    Raises:
        HTTPException 400: si l'encodage du fichier ne peut pas être détecté

    Yields:
        str: portions du fichier CSV généré prêtes à être envoyées au client
    """    
    # Chargement du fichier csv d'origine
    csv_path = Path(project.annotation_file_path)
    if csv_path.exists():
        # détection automatique de l'encodage du fichier
        result = from_path(csv_path).best()
        if result is None:
            raise HTTPException(status_code=400, detail="Impossible de détecter l'encodage du fichier CSV")
        with open(csv_path, newline="", encoding=result.encoding) as csv_file:
            reader = csv.DictReader(csv_file)

            # New header enrichi
            fieldnames = reader.fieldnames + ["annotation", "date"]

            # Créer un fichier en mémoire pour le streaming
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=fieldnames)

            # Ecrire la première ligne et envoyer au client
            writer.writeheader()
            yield output.getvalue()

            # Nettoyer le buffer mémoire
            output.seek(0)
            output.truncate(0)

            # ajout des annotations ligne par ligne
            for idx, row in enumerate(reader):
                # /!\ row_id commence à 1
                ann = annotations_by_row.get(idx+1)

                row["annotation"] = ann.content if ann else ""
                row["date"] = ann.date if ann else ""

                writer.writerow(row)
                # envoi de la ligne au client
                yield output.getvalue()

                # Nettoyage du buffer mémoire
                output.seek(0)
                output.truncate(0)



@router.get("/annotations/{project_id}/export")
async def export_project(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Exporte les annotations d'un projet au format csv.
        - vérifier que le projet existe et qu'il appartient à l'utilisateur
        - récupérer toutes les annotations associées au projet
        - générer un fichier csv enrichi (annotations et dates)
        - envoyer le fichier au client sous forme de flux (streaming)
    Le fichier exporté reprend le fichier d'origine et ajoute 2 colonnes annotation et date

    Args:
        project_id (int): identifiant du projet à exporter
        current_user (User, optional): utilisateur authentifié. Defaults to Depends(get_current_user).
        db (Session, optional): session sqlalchemy. Defaults to Depends(get_db).

    Raises:
        HTTPException: si le projet n'existe pas

    Returns:
        StreamingResponse: réponse http contenant le fichier csv généré dynamiquement, envoyée en streaming 
        pour optimiser l'utilisation mémoire
    """    

    # vérifier et récupérer le projet
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    
    # Récupérer toutes les annotations associées
    annotations = db.query(Annotation).filter(Annotation.project_id == project_id).all()

    # Faire un dict pour itérer avec le row_id d'annotations
    annotations_by_row = {
        ann.row_id: ann for ann in annotations
    }

    # génération et envoi du csv en streaming
    return StreamingResponse(
        generate_csv(project = project, annotations_by_row=annotations_by_row),
        media_type="text/csv",
        headers={
            "Content-disposition": f"attachement; filename=project_{project_id}export.csv"
        }
    )