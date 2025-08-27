# Définir les modèles pour SQLAlchemy

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__="users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    company = Column(String, nullable=True)
    lock_until = Column(DateTime, nullable = True)
    failed_attempts = Column(Integer, default=0, nullable = True)

    projects = relationship("Project", back_populates="user")

class Project(Base):
    __tablename__ = "projects" # Nom de la table correspondate

    id = Column(Integer, primary_key=True, index=True) # Colonne clé primaire (identifiant unique) et création d'index pour accélérer les recherches sur cette colonne
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE")) # ForeignKey : relie cette colonne à la colonne id de la table users, supprime automatiquement les projets si l'utilisateur est supprimé

    user = relationship("User", back_populates="projects") # Crée une relation ORM entre le projet et l'utilisateur