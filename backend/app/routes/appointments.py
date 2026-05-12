from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database.config import get_db
from app.database.models import Appointment, Patient, Doctor, DoctorSlot
from app.schemas.schemas import AppointmentCreate, AppointmentResponse, AppointmentUpdate
from app.utils.jwt_handler import verify_token

router = APIRouter(prefix="/api/v1/appointments", tags=["appointments"])


def get_current_patient(token: str, db: Session = Depends(get_db)):
    """Get current patient from token"""
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    patient = db.query(Patient).filter(Patient.user_id == user_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a patient"
        )
    
    return patient


@router.post("/", response_model=AppointmentResponse)
def create_appointment(
    appointment_data: AppointmentCreate,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Book an appointment with a doctor
    """
    patient = get_current_patient(token, db)
    
    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == appointment_data.doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    # Check if slot is available
    slot = db.query(DoctorSlot).filter(
        DoctorSlot.doctor_id == appointment_data.doctor_id,
        DoctorSlot.slot_date == appointment_data.appointment_date,
        DoctorSlot.slot_time == appointment_data.appointment_time,
        DoctorSlot.is_available == True
    ).first()
    
    if not slot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected slot is not available"
        )
    
    # Create appointment
    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=appointment_data.doctor_id,
        appointment_date=appointment_data.appointment_date,
        appointment_time=appointment_data.appointment_time,
        appointment_type=appointment_data.appointment_type,
        notes=appointment_data.notes,
        status="Upcoming"
    )
    
    db.add(appointment)
    slot.is_available = False
    db.commit()
    db.refresh(appointment)
    
    return appointment


@router.get("/", response_model=List[AppointmentResponse])
def get_patient_appointments(
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Get all appointments for current patient
    """
    patient = get_current_patient(token, db)
    
    appointments = db.query(Appointment).filter(
        Appointment.patient_id == patient.id
    ).order_by(Appointment.appointment_date.desc()).all()
    
    return appointments


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: int,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Get specific appointment details
    """
    patient = get_current_patient(token, db)
    
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.patient_id == patient.id
    ).first()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    return appointment


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int,
    appointment_data: AppointmentUpdate,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Update appointment details
    """
    patient = get_current_patient(token, db)
    
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.patient_id == patient.id
    ).first()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    # Update allowed fields
    if appointment_data.appointment_date:
        appointment.appointment_date = appointment_data.appointment_date
    if appointment_data.appointment_time:
        appointment.appointment_time = appointment_data.appointment_time
    if appointment_data.appointment_type:
        appointment.appointment_type = appointment_data.appointment_type
    if appointment_data.notes:
        appointment.notes = appointment_data.notes
    
    db.commit()
    db.refresh(appointment)
    
    return appointment


@router.delete("/{appointment_id}")
def cancel_appointment(
    appointment_id: int,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Cancel an appointment
    """
    patient = get_current_patient(token, db)
    
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.patient_id == patient.id
    ).first()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    appointment.status = "Cancelled"
    db.commit()
    
    return {"message": "Appointment cancelled successfully"}
