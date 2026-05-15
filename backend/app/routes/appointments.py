from fastapi import APIRouter, Query, HTTPException, status
from typing import List, Optional
from datetime import datetime
from uuid import uuid4
from app.memory_state import get_user_by_email, get_doctor_by_id
from app.schemas.schemas import AppointmentCreate, AppointmentResponse, AppointmentUpdate

router = APIRouter(prefix="/api/v1/appointments", tags=["appointments"])

# In-memory appointment storage
appointments_db = {}


@router.post("/", response_model=dict)
def create_appointment(
    appointment_data: AppointmentCreate,
    token: Optional[str] = Query(None)
):
    """
    Book an appointment with a doctor
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    # Verify doctor exists
    doctor = get_doctor_by_id(appointment_data.doctor_id)
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    # Create appointment in memory
    appointment_id = str(uuid4())
    appointment = {
        "id": appointment_id,
        "doctor_id": appointment_data.doctor_id,
        "appointment_date": str(appointment_data.appointment_date),
        "appointment_time": appointment_data.appointment_time,
        "appointment_type": appointment_data.appointment_type,
        "notes": appointment_data.notes,
        "status": "Upcoming",
        "created_at": datetime.now().isoformat()
    }
    
    appointments_db[appointment_id] = appointment
    
    return {
        "id": appointment_id,
        "doctor_id": appointment_data.doctor_id,
        "appointment_date": appointment_data.appointment_date,
        "appointment_time": appointment_data.appointment_time,
        "appointment_type": appointment_data.appointment_type,
        "notes": appointment_data.notes,
        "status": "Upcoming"
    }


@router.get("/", response_model=List[dict])
def get_patient_appointments(
    token: Optional[str] = Query(None)
):
    """
    Get all appointments for current patient
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    # Return all appointments (in real app, would filter by patient)
    return list(appointments_db.values())


@router.get("/{appointment_id}", response_model=dict)
def get_appointment(
    appointment_id: str,
    token: Optional[str] = Query(None)
):
    """
    Get specific appointment details
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    appointment = appointments_db.get(appointment_id)
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    return appointment


@router.put("/{appointment_id}", response_model=dict)
def update_appointment(
    appointment_id: str,
    appointment_data: AppointmentUpdate,
    token: Optional[str] = Query(None)
):
    """
    Update appointment details
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    appointment = appointments_db.get(appointment_id)
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    # Update allowed fields
    if appointment_data.appointment_date:
        appointment["appointment_date"] = str(appointment_data.appointment_date)
    if appointment_data.appointment_time:
        appointment["appointment_time"] = appointment_data.appointment_time
    if appointment_data.notes:
        appointment["notes"] = appointment_data.notes
    if appointment_data.status:
        appointment["status"] = appointment_data.status
    
    return appointment


@router.delete("/{appointment_id}")
def cancel_appointment(
    appointment_id: str,
    token: Optional[str] = Query(None)
):
    """
    Cancel an appointment
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    appointment = appointments_db.get(appointment_id)
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    appointment["status"] = "Cancelled"
    
    return {"message": "Appointment cancelled", "id": appointment_id}
