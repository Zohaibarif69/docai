from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.config import get_db
from app.database.models import User, Doctor, Appointment, Patient
from app.utils.jwt_handler import verify_token

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


def get_current_admin(token: str, db: Session = Depends(get_db)):
    """Verify admin user"""
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
    
    # TODO: Add admin role check
    # if user.role != "admin":
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Admin access required"
    #     )
    
    return user


@router.get("/stats")
def get_admin_stats(
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Get dashboard statistics for admin
    """
    get_current_admin(token, db)
    
    total_doctors = db.query(Doctor).count()
    total_patients = db.query(Patient).count()
    total_users = db.query(User).count()
    total_appointments = db.query(Appointment).count()
    
    pending_verifications = db.query(Doctor).filter(Doctor.is_verified == False).count()
    completed_appointments = db.query(Appointment).filter(Appointment.status == "Completed").count()
    cancelled_appointments = db.query(Appointment).filter(Appointment.status == "Cancelled").count()
    
    return {
        "totalDoctors": total_doctors,
        "totalPatients": total_patients,
        "totalUsers": total_users,
        "todayAppointments": total_appointments,  # TODO: Filter by today
        "pendingVerifications": pending_verifications,
        "completedAppointments": completed_appointments,
        "cancelledAppointments": cancelled_appointments,
        "activeChats": 0,  # TODO: Implement
        "monthlyRevenue": 0,  # TODO: Implement payment tracking
    }


@router.get("/doctors/pending-verification")
def get_pending_doctors(
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Get doctors pending verification
    """
    get_current_admin(token, db)
    
    doctors = db.query(Doctor).filter(Doctor.is_verified == False).all()
    
    return doctors


@router.put("/doctors/{doctor_id}/verify")
def verify_doctor(
    doctor_id: int,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Approve/verify a doctor
    """
    get_current_admin(token, db)
    
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    doctor.is_verified = True
    db.commit()
    db.refresh(doctor)
    
    # TODO: Send notification to doctor
    
    return {"message": f"Doctor {doctor.user.full_name} verified successfully"}


@router.delete("/doctors/{doctor_id}/reject")
def reject_doctor(
    doctor_id: int,
    reason: str = None,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Reject a doctor's verification
    """
    get_current_admin(token, db)
    
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    # TODO: Send rejection notification to doctor
    db.delete(doctor)
    db.commit()
    
    return {"message": "Doctor verification rejected"}


@router.get("/appointments")
def get_all_appointments(
    skip: int = 0,
    limit: int = 20,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Get all appointments
    """
    get_current_admin(token, db)
    
    appointments = db.query(Appointment).offset(skip).limit(limit).all()
    
    return appointments


@router.get("/users")
def get_all_users(
    skip: int = 0,
    limit: int = 20,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Get all users
    """
    get_current_admin(token, db)
    
    users = db.query(User).offset(skip).limit(limit).all()
    
    return users


@router.put("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    is_active: bool,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Enable/disable user account
    """
    get_current_admin(token, db)
    
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_active = is_active
    db.commit()
    db.refresh(user)
    
    return {"message": f"User status updated to {'active' if is_active else 'inactive'}"}
