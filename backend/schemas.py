# Définir les schémas pydantic

from pydantic import BaseModel, EmailStr, field_validator
import re

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    company: str | None = None

    @field_validator('password')
    def password_complexity(cls, v):
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$'
        if not re.match(pattern, v):
            raise ValueError(
                "Le mot de passe doit contenir au moins 8 caractères, "
                "une majuscule, une minuscule et un caractère spécial."
            )
        return v