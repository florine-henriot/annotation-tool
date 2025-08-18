from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from models import Base
from api import auth
from api import users 

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



# @app.post("/signup")
# def signup(request: SignupRequest, db: Session = Depends(get_db)):
#     user = get_user_by_email(db, request.email)
#     if user:
#         raise HTTPException(status_code=400, detail = "Un utilisateur avec cet email existe déjà.")
    
#     new_user = User(
#         first_name = request.first_name,
#         last_name = request.last_name,
#         email = request.email,
#         password = hashpassword(request.password),
#         company = request.company
#     )
#     db.add(new_user)
#     try:
#         db.commit()
#     except IntegrityError:
#         db.rollback()
#         raise HTTPException(status_code=500, detail = "Erreur lors de la création de l'utilisateur.")
#     return {"success": True}

# @app.get("/protected")
# def protected_route(current_user: str = Depends(get_current_user)):
#     return {"message": f"Bienvenue {current_user} !"}