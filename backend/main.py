from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from models import Base
from api import auth, users, dasboard, annotations

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Middleware pour les headers de sécurité
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)

    # Content Security Policy (CSP)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000; "
        "style-src 'self' 'unsafe-inline' http://localhost:3000; "
        "img-src 'self' data:; "
        "connect-src 'self' http://localhost:3000 http://localhost:8000 ws://localhost:3000; "
        "font-src 'self' data:; "
        "frame-src 'self';"
    )

    # Autres headers de sécurité
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

    return response

# Configuration CORS pour le frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # autorise le frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dasboard.router)
app.include_router(annotations.router)