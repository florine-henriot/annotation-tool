# Définir les schémas pydantic

from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str