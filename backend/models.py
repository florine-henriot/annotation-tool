# Définir les modèles pour SQLAlchemy

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Date, TIMESTAMP
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
    project_name = Column(Text, nullable=False)
    due_date = Column(Date, nullable=False)
    annotation_file_path = Column(Text, nullable = False)
    guidelines_file_path = Column(Text, nullable = False)
    notes = Column(Text, nullable = True)
    created_at = Column(TIMESTAMP, server_default = "CURRENT_TIMESTAMP")
    status = Column(String, default="pending")

    user = relationship("User", back_populates="projects") # Crée une relation ORM entre le projet et l'utilisateur
    annotations = relationship("Annotation", back_populates="project", cascade="all, delete-orphan")

class Annotation(Base):
    __tablename__ = "annotations"

    id = Column(Integer, primary_key=True, index=True)
    row_id = Column(Integer, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    content = Column(String, nullable=True)
    date = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="annotations")
