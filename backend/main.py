from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import status


from pydantic import BaseModel

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # autorise le frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/login")
async def login(request: LoginRequest):
    if request.email != "test@labelia.com" or request.password != "secret":
        return JSONResponse(
            status_code=401,
            content = {"success": False, "message": "Identifiants incorrects"}
        )
    return {"success": True}