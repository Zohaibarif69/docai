from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize in-memory state
from app.memory_state import init_memory_state
init_memory_state()

# Import routes
from app.routes import auth, doctors, appointments, chat, admin

# Initialize FastAPI app
app = FastAPI(
    title=os.getenv("PROJECT_NAME", "Smart Doctor Connect AI"),
    version=os.getenv("PROJECT_VERSION", "1.0.0"),
    description="AI-powered healthcare platform API"
)

# Configure CORS - MUST be added BEFORE routes
origins = os.getenv("BACKEND_CORS_ORIGINS", "[]")
if isinstance(origins, str):
    try:
        origins = eval(origins)
    except:
        origins = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"]

# Add CORS middleware with proper configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include routes AFTER middleware
app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(appointments.router)
app.include_router(chat.router)
app.include_router(admin.router)


@app.get("/")
def root():
    """Root endpoint"""
    return {"message": "Smart Doctor Connect AI Backend", "version": "1.0.0"}
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
