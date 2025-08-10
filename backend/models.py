# Définir les modèles pour SQLAlchemy

from sqlalchemy import Column, Integer, String, DateTime
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