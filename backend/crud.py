# Définir les fonctions de requêtes en db

from sqlalchemy.orm import Session
from models import User, Project

def get_user_by_email(db: Session, email: str):
    """
    Récupère un utilisateur en fonction de son adresse email.

    Args:
        db (Session): la session SQLAlchemy active.
        email (str) : L'adresse email de l'utilisateur à rechercher.

    Returns:
        User | None : L'object User correspondant si trouvé, sinon None.

    Exemple d'utilisation:
    user = get_user_by_email(db, "john.doe@exemple.fr")
    if user:
        print(user.first_name)
    """
    return db.query(User).filter(User.email == email).first()

def get_projects_by_user(db: Session, user_id: int):
    """
    Récupère tous les projets associés à un utilisateur donné.

    Args:
        db (Session): La session SQLAlchemy active.
        user_id (int): L'identifiant unique de l'utilisateur.

    Returns:
        list[Project]: Une liste d'object [Project] liés à cet utilisateur.
            La liste est vide si aucun projet n'est trouvé.

    Exemple d'utilisation:
        projects = get_projects_by_user(db, user_id=1)
        for project in projects:
            print(project.name)
    """
    return db.query(Project).filter(Project.user_id == user_id).all()