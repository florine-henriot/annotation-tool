from pydantic_settings import BaseSettings
from datetime import timedelta
from typing import ClassVar

class Settings(BaseSettings):
    """
    Classe de configuration principale de l'application.

    Les variables sont automatiquement chargées depuis l'environnement 
    (variables système ou .env) grâce à pydantic_settings

    Attributs:
        SECRET_KEY: Clé secrète utilisée pour les mots de passes, signer et vérifier les JWT
        ALGORITHM: Algorithme de signature des JWT (par défaut, HS256)
        ACCESS_TOKEN_EXPIRE_MINUTES : Durée de validité des tokens en minutes (par défaut, 60)
        DATABASE_URL : Châine de connexion à la base de données PostgreSQL
        MAX_ATTEMPTS (int): Nombre maximum de tentatives de conexion avant verrouillage.
        LOCK_TIME: Durée de verrouillage après trop de tentatives (par défaut 60 minutes)
    """
    SECRET_KEY: str
    ALGORITHM : str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES : int = 60
    DATABASE_URL : str
    MAX_ATTEMPTS : int = 5
    LOCK_TIME : ClassVar[timedelta] = timedelta(minutes=60)

settings = Settings()