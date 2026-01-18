# Définir les modèles pour SQLAlchemy

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Date, TIMESTAMP, JSON
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    """Modèle représentant un utilisateur dans la base de données.

    Attributs:
        id (int) : identifiant unique de l'utililisateur (clé primaire)
        email (str) : adresse email de l'utilisateur (unique et obligatoire)
        password (str): mot de passe hashé de l'utilisateur (obligatoire)
        first_name (str): prénom de l'utilisateur (obligatoire)
        last_name (str): nom de famille de l'utilisateur (obligatoire)
        company (str) : entreprise de l'utilisateur (facultatif)
        lock_until (datetime | None) : date et heure jusqu'à laquelle le compte est vérouillé après trop de tentatives de connexion
        failed_attempts (int) : nombre de tentatives de connexion échouée. Defaults 0
        projects (list[Project]) ; relation vers les projets créés par l'utilisateur
    """   

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
    """Modèle représentant un projet d'annotation dans la base de données

    Attributs:
        id (int) : identifiant unique du projet (clé primaire) et indexé pour les recherches
        user_id (int) : clé vers l'utilisateur propriétaire du projet. Supprime automatiquement les projets si l'utilisateur est supprimé (CASCADE)
        project_name (str) : nom du projet (obligatoire)
        due_date (date) : date limite pour la réalisation du projet (obligatoire)
        annotation_file_path (str) : chemin vers le fichier csv d'annotation (obligatoire)
        guidelines_file_path (str) : chemin vers le fichier pdf de guidelines
        notes (str | None) : notes libres associées au projet
        created_at (datetime) : date et heure de création du projet (valeur par défaut, timestamp courant)
        status (str): status du projet, par défaut "pending", peut évoluer vers completed
        categories (list[str]) : liste des catégories d'annotations par jour calculée après la complétion du projet
        user (User) : relation ORM vers l'utilisateur propriétaire du projet
        annotations (list[Annotation]) : relation ORM vers les annotations associées au projet. Les annotations sont supprimés automatiquement si le projet est supprimé
    """    

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
    categories = Column(JSON, nullable=False)
    mean_annotations = Column(Integer, nullable=True)

    user = relationship("User", back_populates="projects") # Crée une relation ORM entre le projet et l'utilisateur
    annotations = relationship("Annotation", back_populates="project", cascade="all, delete-orphan")


class Annotation(Base):
    """Modèle représentant une annotation d'une ligne dans un projet.
    Chaque annotation correspond à une ligne du fichier csv d'origine et peut contenir
    une catégorie choisie par l'utilisateur et la date de validation.

    Attributs:
        id (int) : identifiant unique de l'annotation (clé primaire) et indexé
        row_id (int) : numéroi de la ligne dans le fichier csv d'origine (commence à 1)
        project_id (int) : clé étrangère vers le projet auquel l'annotation appartient. Supprimé automatiquement l'annotation si le projet est supprimé
        content (str | None) : supprime automatiquement l'annotation si le projet est supprimé
        date (datetime | None) : date et heure de validation de l'annotation
        project (Project) : relation ORM vers le projet auquel appartient l'annotation
    """    
    
    __tablename__ = "annotations"

    id = Column(Integer, primary_key=True, index=True)
    row_id = Column(Integer, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    content = Column(String, nullable=True)
    date = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="annotations")