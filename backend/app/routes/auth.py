from fastapi import APIRouter, HTTPException, status, Query, Header
from typing import Optional
from app.memory_state import get_user_by_email, create_user, init_memory_state, get_all_users_dict
from app.schemas.schemas import UserCreate, UserLogin, Token, UserResponse
from app.utils.password_handler import verify_password
from app.utils.jwt_handler import create_access_token, verify_token
from datetime import timedelta

router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])

# Initialize memory state on startup
init_memory_state()


@router.post("/register", response_model=UserResponse)
def register(
    user_data: UserCreate,
    role: str = Query("patient")
):
    """
    Register a new user as patient or doctor
    """
    # Check if user already exists
    existing_user = get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user in memory
    new_user = create_user(
        email=user_data.email,
        full_name=user_data.full_name,
        phone=user_data.phone,
        password=user_data.password,
        role=role
    )
    
    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create user"
        )
    
    return {
        "id": new_user["id"],
        "email": new_user["email"],
        "full_name": new_user["full_name"],
        "phone": new_user["phone"],
        "is_active": new_user["is_active"],
        "is_verified": new_user["is_verified"],
        "created_at": None
    }


@router.post("/login", response_model=Token)
def login(credentials: UserLogin):
    """
    Login user and return JWT token
    """
    user = get_user_by_email(credentials.email)
    
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "phone": user["phone"],
            "is_active": user["is_active"],
            "is_verified": user["is_verified"],
            "created_at": None
        }
    }


@router.get("/me", response_model=UserResponse)
def get_current_user(authorization: str = Header(None)):
    """
    Get current logged-in user info
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Extract token from "Bearer <token>"
    token = authorization.replace("Bearer ", "")
    
    # Verify token and get user_id
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    # Find user by ID in memory
    for email, user_data in get_all_users_dict().items():
        if user_data["id"] == user_id:
            return {
                "id": user_data["id"],
                "email": user_data["email"],
                "full_name": user_data["full_name"],
                "phone": user_data.get("phone", ""),
                "is_active": user_data["is_active"],
                "is_verified": user_data["is_verified"],
                "created_at": None
            }
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )


@router.post("/logout")
def logout():
    """
    Logout user (client should remove token)
    """
    return {"message": "Logged out successfully"}
