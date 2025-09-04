from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from crud import get_user_by_email
from schemas import LoginRequest
from core.security import verify_password, create_access_token, get_current_user
from core.config import settings


router = APIRouter(
    prefix = "/auth",
    tags = ["auth"]
)


@router.get("/protected")
def protected_route(current_user: str = Depends(get_current_user)):
    """
    Route protégée accessible uniquement aux utilisateurs authentifiés.

    Cette route utilise la dépendant "get_current_user", qui lit et valide le cookie "access_token" (JWT).
    Si le jeton est valide, l'utilisateur est considéré comme authentifié et son identité est
    injectée dans la fonction via le paramètre "current_user".

    Etapes : 
        1. Récupère l'utilisateur courant via "Depends(get_current_user)"
        2. Si aucun utilisateur n'est trouvé ou si le JWT est invalide : 
            - Renvoie une erreur 401 "Non autorisé"
        3. Sinon, retourne un message de bienvenue avec l'identifiant de l'utilisateur.

    Paramètres :
        current_user (str) : Identifiant de l'utilisateur authentifié (son email),
        fourni avec current_user.

    Exceptions:
        HTTPException(401) : Si aucun utilisateur n'est authentifié ou si le 
            jeton d'accès est invalide/expiré.

    Returns:
        dict : {message : Bienvenue <utilisateur> ! }
    """
    if not current_user:
        raise HTTPException(status_code=401, detail="Non autorisé")
    return {"message": f"Bienvenue {current_user} !"}


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Authentifie un utilisateur et génère un jeton d'accès JWT stocké dans un cookie HTTPOnly.

    Etapes:

    1. Recherche l'utilisateur par email dans la base de données.
    2. Vérifie si le compte est temporairement vérouillé suite à trop de tentatives échouées.
    3. Vérifie la validité du mot de passe fourni : 
        - Si incorrect : incrément le compte d'échecs et vérouille le compte après N tentatives.
        - Si correct : réinitialise le compteur et retire tout verrouillage.
    4. Génère un jeton JWT contenant l'email de l'utilisateur.
    5. Retourne une réponse JSON avec un cookie 'access_token':
        - httponly=True --> inaccessible côté JavaScript
        - secure=False en dev, secure=True recommandé en production
        - samesite="strict" pour limiter les attaques CRSF
        - max_age=3600 (1h)

    Paramètres : 
        request (LoginRequest) : Object contenant l'email et le mot de passe de l'utilisateur.
        db (Session) : Session SQLAlchemy injectée via Depends(get_db)

    Exceptions : 
        HTTPException(401) : Identifiants incorrects (email inexistant ou mauvais mot de passe)
        HTTPException(403) : Compte vérouillé suite à trop de tentatives échouées.

    Returns:
        JSONResponse : {sucess:True} avec un cookie HTTPOnly "access_token" valide pendant 1h.
    """
    user = get_user_by_email(db, request.email)
    if not user :
        raise HTTPException(status_code = 401, detail = "Identifiants incorrects.")
    
    # Vérifier si le compte est vérouillé
    if user.lock_until and datetime.now() < user.lock_until:
        remaining = int((user.lock_until - datetime.now()).total_seconds() // 60)
        raise HTTPException(status_code=403, detail = f'Trop de tentatives. Réessayez dans {remaining} minutes.')

    # Vérifier le mot de passe
    if not verify_password(request.password, user.password):
        user.failed_attempts += 1
        if user.failed_attempts >= settings.MAX_ATTEMPTS:
            user.lock_until = datetime.now() + settings.LOCK_TIME
            user.failed_attempts = 0 # on remet à 0 pour repartir après le délai
        db.commit()
        raise HTTPException(status_code = 401, detail = "Identifiants incorrects.")

    # Connexion réussie : on reset le compteur
    user.failed_attempts = 0
    user.lock_until = None
    db.commit()

    # Création du JWT
    access_token = create_access_token({"sub": user.email})

    # Réponse avec cookie HTTPOnly
    response = JSONResponse(content={"success": True})
    response.set_cookie(
        key = "access_token",
        value=access_token,
        httponly=True,
        secure=False, # True en prod avec HTTPS
        samesite="strict",
        max_age = 3600 # 1h
    )

    return response


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    return {"success": True, "message": "Vous avez été déconnecté"}