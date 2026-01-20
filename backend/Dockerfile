# Version de python
FROM python:3.11.13-slim

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier et installer les dépendances
# Copier requirements dans le dossier de travail (.)
COPY requirements.txt .
# Execute la commande sans stocker dans le cache (image plus légère)
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le contenu du code
# Dossier source probablement à modifier plus tard
COPY . .

# Exposer le port FastAPI
EXPOSE 8000

# Lancer FastAPI avec hot-reaload
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]