from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import routes
from app.routes import auth, doctors, appointments, chat, admin
from app.database.config import engine
from app.database.models import Base

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=os.getenv("PROJECT_NAME", "Smart Doctor Connect AI"),
    version=os.getenv("PROJECT_VERSION", "1.0.0"),
    description="AI-powered healthcare platform API"
)

# Configure CORS
origins = os.getenv("BACKEND_CORS_ORIGINS", "[]")
if isinstance(origins, str):
    try:
        origins = eval(origins)
    except:
        origins = ["http://localhost:3000", "http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(appointments.router)
app.include_router(chat.router)
app.include_router(admin.router)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Smart Doctor Connect AI API",
        "version": os.getenv("PROJECT_VERSION", "1.0.0"),
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=os.getenv("DEBUG", "True") == "True"
    )
