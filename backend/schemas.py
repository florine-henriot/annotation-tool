# Définir les schémas pydantic

from pydantic import BaseModel, EmailStr, field_validator
import re

class LoginRequest(BaseModel):
    """
    Schéma de validation pour la requête de connexion (login)

    Champs:
        email (EmailStr): Adresse email de l'utilisateur
        password (str): Mot de passe en clair de l'utilisateur

    Exemple de requête JSON:
    {
        "email": "john.doe@exemple.fr",
        "password": "Motdepasse!123"
    }
    """
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    """
    Schéma de validation pour la requête d'inscription.

    Champs:
        first_name (str): Prénom de l'utilisateur
        last_name (str): Nom de famille de l'utilisateur
        email (EmailStr): Adresse mail de l'utilisateur
        password (str): Mot de passe, soumis à une validation de complexité
        company (str): Entreprise de l'utilisateur (facultatif)

    Règles de validation du mot de passe :
    - Au moins 8 caractrèes
    - Contient au moins une lettre minuscule
    - Contient au moins une lettre majuscule
    - Contient au moins un caractère spécial

    Exemple de requête JSON:
    {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane.doe@exemple.fr",
        "password": "Motdepasse!1223"
        "company": "X"
    }
    """
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    company: str | None = None

    @field_validator('password')
    def password_complexity(cls, v):
        """
        Valide la complexité du mot de passe.

        Args:
            v (str): Le mot de passe soumis par l'utilisateur

        Raises: 
            ValueError: Si le mot de passe ne respecte pas les règles de complexité

        Returns:
            str: Le mot de passe validé (inchangé s'il est conforme)
        """
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$'
        if not re.match(pattern, v):
            raise ValueError(
                "Le mot de passe doit contenir au moins 8 caractères, "
                "une majuscule, une minuscule et un caractère spécial."
            )
        return v