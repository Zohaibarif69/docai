from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.config import get_db
from app.database.models import User, Patient, Doctor
from app.schemas.schemas import UserCreate, UserLogin, Token, UserResponse, PatientCreate, PatientResponse
from app.utils.password_handler import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from datetime import timedelta

router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse)
def register(
    user_data: UserCreate,
    role: str = "patient",
    db: Session = Depends(get_db)
):
    """
    Register a new user as patient or doctor
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        phone=user_data.phone,
        password_hash=hash_password(user_data.password)
    )
    db.add(new_user)
    db.flush()
    
    # Create patient or doctor profile
    if role == "patient":
        patient = Patient(user_id=new_user.id)
        db.add(patient)
    elif role == "doctor":
        # Doctor registration requires additional fields
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Use /register/doctor endpoint for doctor registration"
        )
    
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login user and return JWT token
    """
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=UserResponse)
def get_current_user(
    db: Session = Depends(get_db),
    token: str = None
):
    """
    Get current logged-in user info
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    from app.utils.jwt_handler import verify_token
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.post("/logout")
def logout():
    """
    Logout user (client should remove token)
    """
    return {"message": "Logged out successfully"}
