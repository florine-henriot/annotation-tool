# Version de python
FROM python:3.11.13-slim

# Dossier de travail dans le conteneur
WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Copier et installer les dépendances
# Copier requirements dans le dossier de travail (.)
COPY requirements.txt .
# Execute la commande sans stocker dans le cache (image plus légère)
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le contenu du code
# Dossier source probablement à modifier plus tard
COPY . .

RUN chmod +x /app/wait-for-db.sh

# Exposer le port FastAPI
EXPOSE 8000

# Lancer FastAPI avec hot-reaload
CMD ["/app/wait-for-db.sh", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]