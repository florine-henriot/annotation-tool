from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import SignupRequest
from core.security import hashpassword
from crud import get_user_by_email

router = APIRouter(
    prefix = "/users",
    tags = ["users"]
)

@router.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """
    Endpoint pour l'inscription d'un nouvel utilisateur.

    Cette route effectue les étapes suivantes :
    1. Vérifie si un utilisateur avec l'email fourni existe déjà.
        - Si oui, envoie une exception HTTP 400 avec un message d'erreur.
    2. Crée un nouvel utilisateur avec les informations fournies.
        - Le mot de passe est hashé avant d'être stocké.
    3. Ajoute le nouvel utilisateur à la session et tente de le commit dans la base.
        - Si une erreur d'intégrité survient (ex: doublon de clé unique), rollback et renvoie
            HTTP 500.
    4. Si tout se passe bien, renvoie un JSON avec {success: true}

    Args:
        request (SignupRequest): Objet Pydantic contenant les données de l'utilisateur à créer.
            - first_name: str
            - last_name: str
            - email: str
            - password: str
            - company: Optional[str]
        db (Session, optional): Session SQLAlchemy, injectée via Depends(get_db)

    Raises:
        HTTPException 400 : si un utilisateur avec cet email existe déjà
        HTTPException 500 : si une erreur survient de la création de l'utilisateur en base

    Returns:
        dict: Dictionnaire avec {success: true} si la création a réussi.

    Exemple de requête JSON:
    {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@exemple.fr",
        "password": "Motdepasse!123"
        "company": "Mon Entreprise"
    }

    Exemple de réponse:
    {
        "success": True
    }
    """
    # Vérification si l'utilisateur existe déjà
    user = get_user_by_email(db, request.email)
    if user:
        raise HTTPException(status_code=400, detail = "Un utilisateur avec cet email existe déjà.")
    
    # Création de l'utilisateur
    new_user = User(
        first_name = request.first_name,
        last_name = request.last_name,
        email = request.email,
        password = hashpassword(request.password),
        company = request.company
    )

    # Ajout à la session et commit
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail = "Erreur lors de la création de l'utilisateur.")
    
    return {"success": True}