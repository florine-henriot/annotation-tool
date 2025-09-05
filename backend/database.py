# Connexion à PostgreSQL

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import settings

# Création du moteur de base de données SQLAlchemy
engine = create_engine(settings.DATABASE_URL)

# Session locale utilisée pour interagir avec la base de données
# autocommit : False, les transactions doivent être validées manuellement avec commit
# autoflush: False, empêche SQLAlchemy d'envoyer automatiquement les changements avant certaines opérations
# bind: engine, attache cette session au moteur défini ci-dessus
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe de base pour la définition des modèles ORM
# Tous les modèles SQLAlchemy doivent hériter de Base
Base = declarative_base()

def get_db():
    """
    Dépendance FastAPI permettant d'obtenir une session de base de données

    Cette fonction est utilisée dans les endpoints pour fournir un object Session SQLAlchemy.
    Elle s'assure que la sessiosn est ouverte au début de la requête et fermée
    automatiquement à la fin, même en cas d'erreur.

    Exemple d'utilisation dans un endpoint:
    from fastapi import Depends
    from sqlalchemy.orm import Session
    from database import get_db

    @app.get("/users")
    def get_users(db: Session = Depends(get_db)):
        return db.query(User).all()

    Yields:
        Session: une session SQLAlchemy active.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()