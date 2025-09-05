from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Cookie, HTTPException, Depends
from database import get_db
from models import User
from sqlalchemy.orm import Session
from crud import get_user_by_email

from core.config import settings

# Contexte de hashage des mots de passe
# Utilise bcrypt comme algrotihme recommandé
pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

def hashpassword(password: str) -> str:
    """
    Génère un hash sécurisé à partir d'un mot de passe en clair.

    Args:
        password (str): Le mot de passe en clair à hacher.

    Returns: 
        str: Le mot de passe haché (bcrypt)
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Vérifie si un mot de passe en clair correspond à son hash.

    Args:
        plain_password (str): Le mot de passe en clair
        hashed_password (str): Le mot de passe déjà haché.

    Returns:
        bool: True si le mot de passe correspond, sinon False
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Créer un jeton JWT signé pour l'authentification.

    Args:
        data (dict); Les données à inclure dans le payload du token (ex: {"sub": email})
        expires_delta (timedelta | None) : Durée avant expiration du token. Si None, 
                la valeur par défait de settings.ACCESS_TOKEN_EXPIRE_MINUTES est utilisé

    Returns:
        str: Le jeton JWT encodé.
    """
    to_encode = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def get_current_user(db: Session = Depends(get_db), access_token: str = Cookie(None)) -> User:
    """
    Récupère l'utilisateur actuellement authentifié à partir du cookie JWT.

    Cette fonction est utilisée comme dépendance dans les endpoints protégés.
    Elle:
        - Vérifie la présence du token dans les cookies
        - décode le JWT,
        - Extrait l'email de l'utilisateur
        - récupère l'utilisateur en base de données.

    Args:
        db (Session): Session SQLAlchemy injectée via Depends(get_db)
        access_token (str): Jeton JWT stocké dans un cookie access_token

    Returns:
        User: L'objet utilisateur authentifié

    Raises:
        HTTPException (401): Si le token est manquant, invalide expiré ou si l'utilisateur n'existe pas.
    """
    if not access_token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token invalide")
        user = get_user_by_email(db, email)
        if user is None:
            raise HTTPException(status_code = 401, detail = "Utilisateur introuvable")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")