from fastapi import APIRouter, Query, HTTPException, status
from typing import Optional
from app.memory_state import users_db, get_all_doctors
from app.routes.appointments import appointments_db
from app.routes.chat import messages_db

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


@router.get("/stats")
def get_admin_stats(
    token: Optional[str] = Query(None)
):
    """
    Get dashboard statistics for admin
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    total_doctors = len(get_all_doctors())
    total_patients = len([u for u in users_db.values() if u["role"] == "patient"])
    total_users = len(users_db)
    total_appointments = len(appointments_db)
    total_messages = sum(len(msgs) for msgs in messages_db.values())
    
    return {
        "total_doctors": total_doctors,
        "total_patients": total_patients,
        "total_users": total_users,
        "total_appointments": total_appointments,
        "total_messages": total_messages,
        "timestamp": None
    }


@router.get("/doctors")
def get_all_doctors_admin(
    token: Optional[str] = Query(None)
):
    """
    Get list of all doctors (admin view)
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    return get_all_doctors()


@router.get("/users")
def get_all_users_admin(
    token: Optional[str] = Query(None)
):
    """
    Get list of all users (admin view)
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    # Return user list without password hashes
    return [
        {
            "id": u["id"],
            "email": u["email"],
            "full_name": u["full_name"],
            "phone": u["phone"],
            "is_active": u["is_active"],
            "is_verified": u["is_verified"],
            "role": u.get("role", "patient")
        }
        for u in users_db.values()
    ]


@router.get("/appointments")
def get_all_appointments_admin(
    token: Optional[str] = Query(None)
):
    """
    Get list of all appointments (admin view)
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    return list(appointments_db.values())
