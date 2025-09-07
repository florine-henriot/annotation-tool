from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from models import Base
from api import auth, users, dashboard, annotations

from fastapi.staticfiles import StaticFiles

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Middleware pour les headers de sécurité
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)

    # Content Security Policy (CSP)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000 https://cdn.jsdelivr.net; "
        "style-src 'self' 'unsafe-inline' http://localhost:3000 https://cdn.jsdelivr.net; "
        "img-src 'self' data:; "
        "connect-src 'self' http://localhost:3000 http://localhost:8000 ws://localhost:3000; "
        "font-src 'self' data: https://cdn.jsdelivr.net; "
        "frame-src 'self' http://localhost:3000;"
    )

    # Autres headers de sécurité
    response.headers["X-Content-Type-Options"] = "nosniff"
    #response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

    return response

# Configuration CORS pour le frontend local
origins = [
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # autorise le frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dashboard.router)
app.include_router(annotations.router)